import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { ArrowLeft, Filter, Users, Calendar, Building, Award, User, RefreshCw, HelpCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toast } from '../../Components/ui/Toast';

/* ------------ utils ------------ */
const pad2 = (n) => (n < 10 ? `0${n}` : String(n));

/* Parse "YYYY-MM-DD" as LOCAL date to avoid off-by-one */
const localDateFromYmd = (ymd) => {
    if (!ymd) return null;
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const getDaysInMonth = (yyyyMm) => {
    if (!yyyyMm) return 31;
    const [y, m] = yyyyMm.split('-').map(Number);
    return new Date(y, m, 0).getDate();
};

const CODE_LABELS = {
    P: 'Present',
    A: 'Absent',
    L: 'Late',
    WO: 'Week Off',
    '½P': 'Half Present',
    H: 'Holiday'
};

const CELL_DISPLAY_CODES = {
    P: 'P',
    A: 'A',
    L: 'L',
    WO: 'WO',
    '½P': '½P',
    H: 'H'
};

/* Legend order must stay fixed */
const TOTALS_ORDER = ['P', 'A', 'L', 'WO', '½P', 'H'];

/* Enhanced status colors matching the design */
const CODE_COLORS = {
    P: 'bg-[var(--color-code-p-bg)] text-[var(--color-code-p-text)] border border-[var(--color-code-p-border)]',
    A: 'bg-[var(--color-code-a-bg)] text-[var(--color-a-text)] border border-[var(--color-code-a-border)]',
    L: 'bg-[var(--color-code-l-bg)] text-[var(--color-code-l-text)] border border-[var(--color-code-l-border)]',
    "½P": 'bg-[var(--color-code-halfp-bg)] text-[var(--color-code-halfp-text)] border border-[var(--color-code-halfp-border)]',
    WO: 'bg-[var(--color-code-wo-bg)] text-[var(--color-code-wo-text)] border border-[var(--color-code-wo-border)]',
    H: 'bg-[var(--color-code-h-bg)] text-[var(--color-code-h-text)] border border-[var(--color-code-h-border)]',
};

const CELL_STATUS_COLORS = {
    P: 'bg-[var(--color-cell-p-bg)] text-[var(--color-cell-p-text)] border-l-4 border-l-[var(--color-cell-p-border)]',
    A: 'bg-[var(--color-cell-a-bg)] text-[var(--color-cell-a-text)] border-l-4 border-l-[var(--color-cell-a-border)]',
    L: 'bg-[var(--color-cell-l-bg)] text-[var(--color-cell-l-text)] border-l-4 border-l-[var(--color-cell-l-border)]',
    "½P": 'bg-[var(--color-cell-halfp-bg)] text-[var(--color-cell-halfp-text)] border-l-4 border-l-[var(--color-cell-halfp-border)]',
    WO: 'bg-[var(--color-cell-wo-bg)] text-[var(--color-cell-wo-text)] border-l-4 border-l-[var(--color-cell-wo-border)]',
    H: 'bg-[var(--color-cell-h-bg)] text-[var(--color-cell-h-text)] border-l-4 border-l-[var(--color-cell-h-border)]',
};

/* Responsive cell sizes */
const CELL_W = 70;  // Desktop
const CELL_W_MOBILE = 50;  // Mobile - smaller for better fit
const CELL_H = 40;  // Consistent height

const normalizeCode = (rawShort, rawStatus) => {
    let s = (rawShort || '').toString().trim().toUpperCase();
    if (s === '1/2P' || s === '1/2' || s === 'HALF' || s === 'HALF PRESENT') s = '½P';
    if (s === 'HP ') s = 'HP';
    if (TOTALS_ORDER.includes(s)) return s;

    const status = (rawStatus || '').toLowerCase();
    if (status.includes('week') && status.includes('off')) return 'WO';
    if (status.includes('half') && status.includes('present')) return '½P';
    if (status.includes('present')) return 'P';
    if (status.includes('absent')) return 'A';
    if (status.includes('holiday')) return 'H';
    if (status === 'late') return 'L';
    return '';
};

const MonthlyAttendance = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const containerRef = useRef(null);

    // Detect screen size for responsive cell widths
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const cellWidth = isMobile ? CELL_W_MOBILE : CELL_W;

    // Initialize filters first
    const initialFilters = location.state?.filters || {
        branch_id: '',
        department_id: '',
        designation_id: '',
        employee_id: '',
        month_year: new Date().toISOString().slice(0, 7),
    };

    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Now filters is available, so we can use it in useMemo
    const daysInMonth = useMemo(() => getDaysInMonth(filters.month_year), [filters.month_year]);

    /* Simple day meta (no weekend styling) */
    const dayMeta = useMemo(() => {
        if (!filters.month_year) return [];
        return Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
    }, [filters.month_year, daysInMonth]);

    const gridData = useMemo(() => {
        if (!rows?.length) return [];
        const byEmp = new Map();

        rows.forEach(r => {
            const key = `${r.employee_code}||${r.employee_name}`;
            if (!byEmp.has(key)) {
                byEmp.set(key, {
                    employee_code: r.employee_code,
                    employee_name: r.employee_name,
                    dayCodes: Array.from({ length: daysInMonth }, () => ''),
                    totals: TOTALS_ORDER.reduce((acc, c) => (acc[c] = 0, acc), {}),
                });
            }
            const obj = byEmp.get(key);
            const d = localDateFromYmd(r.date);
            if (!d || isNaN(d)) return;

            const day = d.getDate();
            const c = normalizeCode(r.short_status, r.status);
            if (day >= 1 && day <= daysInMonth && c) {
                obj.dayCodes[day - 1] = c;
                if (c in obj.totals) obj.totals[c] += 1;
            }
        });

        return Array.from(byEmp.values());
    }, [rows, daysInMonth]);

    const gridTemplate = useMemo(() => {
        const empCodeWidth = isMobile ? '80px' : '100px';
        const nameWidth = isMobile ? '120px' : '150px';
        const dayWidth = `${cellWidth}px`;
        const totalsWidth = isMobile ? '150px' : '200px';
        return `${empCodeWidth} ${nameWidth} repeat(${daysInMonth}, ${dayWidth}) ${totalsWidth}`;
    }, [daysInMonth, isMobile, cellWidth]);

    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            setError('');
            if (!user?.user_id) throw new Error('User ID is required');
            const form = new FormData();
            form.append('user_id', user.user_id);
            const res = await api.post('employee_drop_down_list', form);
            if (res.data?.success && res.data.data) {
                const data = res.data.data;
                setBranches((data.branch_list || []).map(b => ({ id: b.branch_id, name: b.name })));
                setDepartments((data.department_list || []).map(d => ({ id: d.department_id, name: d.name })));
                setDesignations((data.designation_list || []).map(d => ({ id: d.designation_id, name: d.name })));
            } else {
                throw new Error(res.data?.message || 'Failed to load filter options');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to load dropdown options');
        } finally {
            setDropdownLoading(false);
        }
    }, [user?.user_id]);

    const fetchEmployees = useCallback(async () => {
        try {
            setError('');
            if (!user?.user_id) throw new Error('User ID is required');
            const form = new FormData();
            form.append('user_id', user.user_id);
            if (filters.branch_id) form.append('branch_id', filters.branch_id);
            if (filters.department_id) form.append('department_id', filters.department_id);
            if (filters.designation_id) form.append('designation_id', filters.designation_id);

        } catch (e) {
            console.error(e);
            setError('Failed to load employees');
        }
    }, [user?.user_id, filters.branch_id, filters.department_id, filters.designation_id]);

    const fetchReportData = useCallback(async () => {
        if (!user?.user_id) throw new Error('User ID is required');
        if (!filters.month_year) throw new Error('Please select Month & Year');

        const form = new FormData();
        form.append('user_id', user.user_id);
        form.append('month_year', filters.month_year);
        if (filters.branch_id) form.append('branch_id', filters.branch_id);
        if (filters.department_id) form.append('department_id', filters.department_id);
        if (filters.designation_id) form.append('designation_id', filters.designation_id);

        const res = await api.post('monthly_attendance_report_list', form);
        if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
        throw new Error(res.data?.message || 'Failed to fetch report data');
    }, [user?.user_id, filters]);

    /* Auto-load on filter change (debounced) */
    const debTimer = useRef(null);
    useEffect(() => {
        if (debTimer.current) clearTimeout(debTimer.current);
        debTimer.current = setTimeout(async () => {
            try {
                setLoading(true);
                setError('');
                const data = await fetchReportData();
                setRows(data || []);
            } catch (e) {
                console.error(e);
                setError(e.message || 'Failed to load data');
                setRows([]);
            } finally {
                setLoading(false);
                // Always start from day 1
                if (containerRef.current) containerRef.current.scrollLeft = 0;
            }
        }, 300);
        return () => clearTimeout(debTimer.current);
    }, [fetchReportData]);

    useEffect(() => { fetchDropdownData(); }, [fetchDropdownData]);
    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleFilterChange = (key, value) => {
        setRows([]); // clear while reloading
        setError('');
        setFilters(prev => {
            const next = { ...prev, [key]: value };
            if (key === 'branch_id') { next.department_id = ''; next.designation_id = ''; next.employee_id = ''; }
            else if (key === 'department_id') { next.designation_id = ''; next.employee_id = ''; }
            else if (key === 'designation_id') { next.employee_id = ''; }
            return next;
        });
    };

    const resetFilters = () => {
        setFilters({
            branch_id: '',
            department_id: '',
            designation_id: '',
            employee_id: '',
            month_year: new Date().toISOString().slice(0, 7),
        });
        setRows([]);
        setError('');
    };

    const formatMonthYear = (monthYear) => {
        if (!monthYear) return '--';
        const [year, month] = monthYear.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-4 sm:pb-8">
            <div className="p-3 sm:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl sm:rounded-2xl shadow-xl mb-4 sm:mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-1 sm:gap-2 text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm text-xs sm:text-sm flex-shrink-0"
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Back</span>
                                </button>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <h1 className="text-base sm:text-2xl font-bold text-[var(--color-text-white)]">
                                        Monthly Attendance
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-1 sm:gap-2 bg-[var(--color-bg-secondary)] text-blue-600 hover:bg-[var(--color-bg-primary)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                                >
                                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 text-red-700 text-xs sm:text-sm">
                            <HelpCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">Error:</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Filters - Collapsible */}
                {showFilters && (
                    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-[var(--color-shadow-light)] border border-[var(--color-border-secondary)] p-3 sm:p-5 mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-[var(--color-blue-lightest)] rounded-lg">
                                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-blue)]" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">Filters</h2>
                            </div>
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors duration-200 text-xs sm:text-sm"
                            >
                                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                            {/* Month Year */}
                            <div className="flex flex-col z-40">
                                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">
                                    <Calendar className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Month & Year <span className="text-[var(--color-text-error)]">*</span>
                                </label>
                                <DatePicker
                                    selected={filters.month_year ? new Date(`${filters.month_year}-01`) : null}
                                    onChange={(date) => {
                                        const iso = date ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}` : '';
                                        handleFilterChange('month_year', iso);
                                    }}
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-xs sm:text-sm"
                                    placeholderText="Select month and year"
                                    maxDate={new Date()}
                                    showPopperArrow={false}
                                />
                            </div>

                            {/* Branch */}
                            <div className="flex flex-col">
                                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">
                                    <Building className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Branch
                                </label>
                                <select
                                    value={filters.branch_id}
                                    onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)] text-xs sm:text-sm"
                                    disabled={dropdownLoading}
                                >
                                    <option value="">All Branches</option>
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            {/* Department */}
                            <div className="flex flex-col">
                                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">
                                    <Users className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Department
                                </label>
                                <select
                                    value={filters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)] text-xs sm:text-sm"
                                    disabled={dropdownLoading}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            {/* Designation */}
                            <div className="flex flex-col">
                                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 sm:mb-2">
                                    <Award className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Designation
                                </label>
                                <select
                                    value={filters.designation_id}
                                    onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)] text-xs sm:text-sm"
                                    disabled={dropdownLoading}
                                >
                                    <option value="">All Designations</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm border border-[var(--color-border-secondary)] overflow-hidden">
                    <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)]">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2 text-base sm:text-xl">
                                    Monthly Attendance Report
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-medium">
                                    {formatMonthYear(filters.month_year)}
                                </p>
                            </div>

                            {/* Enhanced Legend */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                {TOTALS_ORDER.map((c) => (
                                    <div
                                        key={c}
                                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs font-medium ${CODE_COLORS[c] || 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)]'} shadow-sm`}
                                    >
                                        <span className="font-bold text-xs">{c}</span>
                                        <span className="hidden sm:inline text-xs opacity-75">{CODE_LABELS[c]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="relative h-1 bg-gray-200">
                            <div className="absolute inset-y-0 left-0 bg-blue-600 animate-pulse w-1/3" />
                        </div>
                    )}

                    {/* Data grid */}
                    <div
                        ref={containerRef}
                        className="overflow-auto max-h-[60vh] sm:max-h-[70vh]"
                        style={{
                            minWidth: '100%',
                        }}
                    >
                        <div style={{
                            minWidth: isMobile
                                ? `${80 + 120 + (daysInMonth * CELL_W_MOBILE) + 150}px`
                                : `${100 + 150 + (daysInMonth * CELL_W) + 200}px`
                        }}>
                            {/* Header row */}
                            <div
                                className="sticky top-0 z-20 bg-[var(--color-bg-primary)] border-b-2 border-[var(--color-border-secondary)]"
                                style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
                            >
                                <div className="px-1 sm:px-2 md:px-3 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border-primary)] sticky left-0 z-30 bg-[var(--color-bg-surface)]">
                                    <span className="hidden md:inline">Employee Code</span>
                                    <span className="md:hidden">Emp Code</span>
                                </div>
                                <div
                                    className="px-1 sm:px-2 md:px-3 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border-primary)] sticky z-30 bg-[var(--color-bg-surface)]"
                                    style={{ left: isMobile ? '80px' : '100px' }}
                                >
                                    <span className="hidden md:inline">Employee Name</span>
                                    <span className="md:hidden">Name</span>
                                </div>

                                {dayMeta.map(({ day }) => (
                                    <div
                                        key={day}
                                        className="text-[10px] sm:text-xs font-bold text-center border-r border-[var(--color-border-secondary)] flex items-center justify-center text-gray-700 bg-[var(--color-bg-primary)]"
                                        style={{ height: `${CELL_H}px` }}
                                    >
                                        {day}
                                    </div>
                                ))}

                                <div className="px-1 sm:px-2 md:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-bold text-[var(--color-text-primary)]">
                                    <span className="hidden md:inline">Summary Totals</span>
                                    <span className="md:hidden">Totals</span>
                                </div>
                            </div>

                            {/* Empty state */}
                            {gridData.length === 0 && !loading && (
                                <div className="p-4 sm:p-8 text-center">
                                    <div className="text-gray-400 mb-2 sm:mb-4">
                                        <Users size={32} className="mx-auto sm:w-12 sm:h-12" />
                                    </div>
                                    <p className="text-gray-600 font-medium text-sm sm:text-lg">No attendance data found</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        The selected filters don't match any records for this month
                                    </p>
                                </div>
                            )}

                            {/* Data rows */}
                            {gridData.map((r, rowIndex) => {
                                return (
                                    <div
                                        key={`${r.employee_code}-${rowIndex}`}
                                        className={`border-b border-[var(--color-border-secondary)] transition-colors duration-150 bg-[var(--color-bg-secondary)]`}
                                        style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
                                    >
                                        {/* Employee Code - Sticky */}
                                        <div className={`px-1 sm:px-2 md:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-secondary)] sticky left-0 z-10 bg-[var(--color-bg-secondary)] break-words`}>
                                            {r.employee_code}
                                        </div>

                                        {/* Employee Name - Sticky */}
                                        <div
                                            className={`px-1 sm:px-2 md:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border-secondary)] sticky z-10 bg-[var(--color-bg-secondary)] truncate`}
                                            style={{ left: isMobile ? '80px' : '100px' }}
                                        >
                                            {r.employee_name}
                                        </div>

                                        {/* Day cells with enhanced styling */}
                                        {r.dayCodes.map((c, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className="flex items-center justify-center text-[9px] sm:text-xs font-medium py-0.5 sm:py-1 mr-0.5 sm:mr-1 ml-0.5 sm:ml-1"
                                            >
                                                {c && (
                                                    <div className={`w-full h-full rounded-md flex items-center justify-center text-[9px] sm:text-xs font-bold ${CELL_STATUS_COLORS[c] || 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-l-4 border-l-[var(--color-border-secondary)]'}`}>
                                                        {CELL_DISPLAY_CODES[c] || c}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Totals column */}
                                        <div className="px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 flex flex-wrap items-center gap-0.5 sm:gap-1">
                                            {TOTALS_ORDER.filter(k => r.totals[k] > 0).map(k => (
                                                <span
                                                    key={k}
                                                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${CODE_COLORS[k] || 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
                                                >
                                                    <span className="font-bold text-xs">{k}</span>
                                                    <span className="bg-white/50 px-0.5 sm:px-1 rounded text-xs font-bold">
                                                        {Number.isInteger(r.totals[k]) ? r.totals[k] : r.totals[k].toFixed(1)}
                                                    </span>
                                                </span>
                                            ))}
                                            {TOTALS_ORDER.every(k => r.totals[k] === 0) && (
                                                <span className="text-gray-500 text-xs sm:text-sm">No records</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyAttendance;