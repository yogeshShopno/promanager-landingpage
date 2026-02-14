// src/pages/Reports/MonthlyReport.jsx
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import {
    Calendar,
    Users,
    Building,
    Award,
    User,
    ArrowLeft,
    Filter,
    RefreshCw,
    Loader2,
    ChevronDown,
    FileDown,
    FileSpreadsheet,
    Zap,
    CheckCircle,
    AlertCircle,
    Info,
    Target,
    Download,
    AlertTriangle,
    Play,
    HelpCircle
} from 'lucide-react';
import { SearchableDropdown } from '../../Components/Report/ReportComponents';
import { Toast } from '../../Components/ui/Toast';
import { exportMonthlyReportToPDF } from '../../utils/exportUtils/MonthlyReport/pdfExportMonthly';
import { exportToExcel } from '../../utils/exportUtils/MonthlyReport/excelExportMonthly';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/** ------------------- Anchored positioning helpers ------------------- **/
const getScrollParents = (node) => {
    const parents = [];
    if (!node) return parents;
    let parent = node.parentNode;
    const scrollRegex = /(auto|scroll|overlay)/i;
    while (parent && parent.nodeType === 1) {
        const style = window.getComputedStyle(parent);
        const overflow = `${style.overflow} ${style.overflowY} ${style.overflowX}`;
        if (scrollRegex.test(overflow)) parents.push(parent);
        parent = parent.parentNode;
    }
    parents.push(window);
    return parents;
};
// New function to add
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};

const useAnchoredPosition = (anchorRef, isOpen, opts = {}) => {
    const { placement = 'bottom-end', offset = 8, minWidth = 220, minHeight = 120 } = opts;
    const [pos, setPos] = useState({ top: -9999, left: -9999, width: 0, ready: false });
    const cleanupRef = useRef([]);

    const compute = useCallback(() => {
        const el = anchorRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate initial position
        let top = rect.bottom + scrollY + offset;
        let left;

        if (placement === 'bottom-start') {
            left = rect.left + scrollX;
        } else if (placement === 'bottom-center') {
            left = rect.left + scrollX + rect.width / 2 - minWidth / 2;
        } else {
            left = rect.left + scrollX + rect.width - minWidth; // bottom-end
        }

        // Check if dropdown would go below viewport
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = minHeight; // estimated dropdown height

        // If not enough space below and more space above, flip to top
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            top = rect.top + scrollY - dropdownHeight - offset;
        }

        // Ensure dropdown doesn't go off-screen horizontally
        const rightEdge = left + minWidth;
        if (rightEdge > viewportWidth) {
            left = viewportWidth - minWidth - 10; // 10px margin from edge
        }
        if (left < 10) {
            left = 10; // 10px margin from left edge
        }

        setPos({ top, left, width: rect.width, ready: true });
    }, [anchorRef, offset, placement, minWidth, minHeight]);

    useLayoutEffect(() => {
        if (!isOpen) {
            cleanupRef.current.forEach((fn) => fn && fn());
            cleanupRef.current = [];
            setPos((p) => ({ ...p, ready: false }));
            return;
        }

        compute();

        const parents = getScrollParents(anchorRef.current);
        let ticking = false;
        const handler = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                compute();
                ticking = false;
            });
        };

        parents.forEach((p) => p.addEventListener('scroll', handler, { passive: true }));
        window.addEventListener('resize', handler, { passive: true });

        const remove = () => {
            parents.forEach((p) => p.removeEventListener('scroll', handler));
            window.removeEventListener('resize', handler);
        };
        cleanupRef.current.push(remove);

        return () => {
            remove();
            cleanupRef.current = [];
        };
    }, [isOpen, compute, anchorRef]);

    return pos;
};
/** -------------------------------------------------------------------- **/

const MonthlyReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filters (Employee optional)
    const [filters, setFilters] = useState({
        branch_id: '',
        department_id: '',
        designation_id: '',
        employee_id: '',
        month_year: new Date().toISOString().slice(0, 7)
    });

    // Pretty names for export header
    const [filterNames, setFilterNames] = useState({
        branch_name: '',
        department_name: '',
        designation_name: ''
    });

    const [reportData, setReportData] = useState([]);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dropdown data
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [dropdownLoading, setDropdownLoading] = useState(false);

    // Export dropdown - FIXED: Correct state variable name
    const [exportDropdown, setExportDropdown] = useState(false);
    const exportBtnRef = useRef(null);
    const exportPos = useAnchoredPosition(exportBtnRef, exportDropdown, {
        placement: 'bottom-end',
        offset: 8,
        minWidth: 240,
        minHeight: 120
    });

    // State for actions + toast
    // eslint-disable-next-line no-unused-vars
    const [generating, setGenerating] = useState(false);
    const [toast, setToast] = useState(null);
    const showToast = (message, type) => setToast({ message, type });
    const closeToast = () => setToast(null);

    /** Fetch dropdown data */
    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            setError('');
            if (!user?.user_id) throw new Error('User ID is required');

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('employee_drop_down_list', formData);
            if (response.data?.success && response.data.data) {
                const data = response.data.data;
                setBranches((data.branch_list || []).map((b) => ({ id: b.branch_id, name: b.name })));
                setDepartments((data.department_list || []).map((d) => ({ id: d.department_id, name: d.name })));
                setDesignations((data.designation_list || []).map((d) => ({ id: d.designation_id, name: d.name })));
            } else {
                throw new Error(response.data?.message || 'Failed to fetch dropdown data');
            }
        } catch (err) {
            setError('Failed to load filter options');
            showToast(err.message || 'Failed to load filter options', 'error');
        } finally {
            setDropdownLoading(false);
        }
    }, [user?.user_id]);

    /** Fetch employees cascaded */
    const fetchEmployees = useCallback(async () => {
        try {
            setError('');
            if (!user?.user_id) throw new Error('User ID is required');

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            if (filters.branch_id) formData.append('branch_id', filters.branch_id);
            if (filters.department_id) formData.append('department_id', filters.department_id);
            if (filters.designation_id) formData.append('designation_id', filters.designation_id);

            const response = await api.post('report_employee_list_drop_down', formData);
            if (response.data?.success && response.data.data) {
                const list = response.data.data.employee_list || [];
                setEmployees(
                    list.map((emp) => ({
                        id: emp.employee_id,
                        name: `${emp.full_name} `
                    }))
                );
            } else {
                throw new Error(response.data?.message || 'Failed to fetch employees');
            }
        } catch (err) {
            setError('Failed to load employees');
            showToast(err.message || 'Failed to load employees', 'error');
        }
    }, [user?.user_id, filters.branch_id, filters.department_id, filters.designation_id]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    /** Backend fetch for report data (employee optional) */
    const fetchReportData = async () => {
        if (!user?.user_id) throw new Error('User ID is required');
        if (!filters.month_year) throw new Error('Please select a month and year');

        const formData = new FormData();
        formData.append('user_id', user.user_id);
        formData.append('month_year', filters.month_year);

        if (filters.branch_id) formData.append('branch_id', filters.branch_id);
        if (filters.department_id) formData.append('department_id', filters.department_id);
        if (filters.designation_id) formData.append('designation_id', filters.designation_id);
        if (filters.employee_id) formData.append('employee_id', filters.employee_id);

        const endpoint = 'monthly_attendance_report_list';
        const response = await api.post(endpoint, formData);

        if (response.data?.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data?.message || 'Failed to fetch report data');
    };

    /** Single source of truth for cascading field changes (prevents double set) */
    const handleFilterChange = (key, value) => {
        setReportData([]); // Clear data when filters change
        setHasGenerated(false); // Reset generated state
        setError('');

        setFilters((prev) => {
            const next = { ...prev, [key]: value };

            if (key === 'branch_id') {
                next.department_id = '';
                next.designation_id = '';
                next.employee_id = '';
            } else if (key === 'department_id') {
                next.designation_id = '';
                next.employee_id = '';
            } else if (key === 'designation_id') {
                next.employee_id = '';
            }

            return next;
        });

        // Update label names separately
        if (key === 'branch_id') {
            const selected = branches.find((b) => b.id === value);
            setFilterNames((p) => ({ ...p, branch_name: selected?.name || '', department_name: '', designation_name: '' }));
        } else if (key === 'department_id') {
            const selected = departments.find((d) => d.id === value);
            setFilterNames((p) => ({ ...p, department_name: selected?.name || '', designation_name: '' }));
        } else if (key === 'designation_id') {
            const selected = designations.find((d) => d.id === value);
            setFilterNames((p) => ({ ...p, designation_name: selected?.name || '' }));
        }
    };

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchReportData();

            // New data transformation logic
            const groupedData = data.reduce((acc, current) => {
                const employeeCode = current.employee_code;
                if (!acc[employeeCode]) {
                    acc[employeeCode] = {
                        employee_code: employeeCode,
                        employee_name: current.employee_name,
                        dailyAttendance: {}, // Object to store attendance by day
                    };
                }
                const day = new Date(current.date).getDate();
                acc[employeeCode].dailyAttendance[day] = {
                    inTime: current.attandance_first_clock_in,
                    outTime: current.attandance_last_clock_out,
                    totalHours: current.attandance_hours,
                    status: current.short_status,
                    fullStatus: current.status
                };
                return acc;
            }, {});

            setReportData(Object.values(groupedData)); // Convert back to an array
            setHasGenerated(true);
            showToast('Report generated successfully!', 'success');
        } catch (e) {
            console.error(e);
            setError(e.message || 'Failed to load data');
            showToast(e.message || 'Failed to load data', 'error');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    /** Reset filters */
    const resetFilters = () => {
        setFilters({
            branch_id: '',
            department_id: '',
            designation_id: '',
            employee_id: '',
            month_year: new Date().toISOString().slice(0, 7)
        });
        setFilterNames({ branch_name: '', department_name: '', designation_name: '' });
        setExportDropdown(false);
        setReportData([]);
        setHasGenerated(false);
        setError('');
        showToast('Filters reset successfully', 'success');
    };

    // Helper function to get status colors
    const getStatusColor = (shortStatus) => {
        switch (shortStatus) {
            case 'P': return 'bg-[var(--color-cell-p-bg)] text-[var(--color-cell-p-text)] border-l-4 border-l-[var(--color-cell-p-border)]';
            case 'A': return 'bg-[var(--color-cell-a-bg)] text-[var(--color-cell-a-text)] border-l-4 border-l-[var(--color-cell-a-border)]';
            case 'L': return 'bg-[var(--color-cell-l-bg)] text-[var(--color-cell-l-text)] border-l-4 border-l-[var(--color-cell-l-border)]';
            case 'WO': return 'bg-[var(--color-cell-wo-bg)] text-[var(--color-cell-wo-text)] border-l-4 border-l-[var(--color-cell-wo-border)]';
            case '1/2P': return 'bg-[var(--color-cell-halfp-bg)] text-[var(--color-cell-halfp-text)] border-l-4 border-l-[var(--color-cell-halfp-border)]';
            case 'H': return 'bg-[var(--color-cell-h-bg)] text-[var(--color-cell-h-text)] border-l-4 border-l-[var(--color-cell-h-border)]';
            default: return 'bg-[var(--color-cell-wo-bg)] text-[var(--color-cell-wo-text)] border-l-4 border-l-[var(--color-cell-wo-border)]';
        }
    };

    // Format month year helper
    const formatMonthYear = (monthYear) => {
        if (!monthYear) return '--';
        const [year, month] = monthYear.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    /** FIXED: Export handlers */
    const handleExportExcelClick = async () => {
        await doExport('excel');
    };

    const handleExportPDF = async () => {
        await doExport('pdf');
    };

    /** Export handlers */
    const doExport = async (type) => {
        try {
            setGenerating(true);

            if (!reportData || reportData.length === 0) {
                showToast('No data available for export', 'error');
                return;
            }

            const filtersForExport = { ...filters, ...filterNames };

            if (type === 'excel') {
                // Calculate start and end dates from month_year
                const [year, month] = filters.month_year.split('-');
                const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                const endDate = new Date(parseInt(year), parseInt(month), 0);

                exportToExcel(
                    reportData,
                    startDate, // Pass actual start date
                    endDate,   // Pass actual end date
                    'monthly_attendance_report', // filename
                    {
                        showTitle: true,
                        showSummary: true,
                        showEmployeeDetails: true,
                        reportTitle: 'Monthly Attendance Report'
                    }
                );
                showToast('Excel exported successfully!', 'success');
            } else {
                const result = await exportMonthlyReportToPDF(reportData, filtersForExport, {
                    companyName: (user?.full_name),
                    fileName: `monthly-attendance-${filters.month_year || 'report'}.pdf`
                });
                if (result?.success) {
                    showToast('PDF exported successfully!', 'success');
                } else {
                    showToast(result?.message || 'Failed to export PDF', 'error');
                }
            }

            setExportDropdown(false);
        } catch (e) {
            showToast(e.message || 'Export failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    /** -------- Render -------- */
    return (

        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[var(--color-text-white)]">Monthly Attendance Report</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        ref={exportBtnRef}
                                        onClick={() => setExportDropdown((v) => !v)}
                                        disabled={!hasGenerated || reportData.length === 0}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {/* Export Dropdown (anchored) */}
                                    {exportDropdown &&
                                        exportPos.ready &&
                                        createPortal(
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setExportDropdown(false)} />
                                                <div
                                                    className="absolute z-50 bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-secondary)] py-2"
                                                    style={{
                                                        position: 'absolute',
                                                        top: exportPos.top,
                                                        left: exportPos.left,
                                                        width: Math.max(192, exportPos.width),
                                                        minWidth: 192
                                                    }}
                                                >
                                                    <button
                                                        onClick={handleExportExcelClick}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                    >
                                                        <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                        Export to Excel
                                                    </button>
                                                    <button
                                                        onClick={handleExportPDF}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                    >
                                                        <FileDown className="h-4 w-4 text-red-600" />
                                                        Export to PDF
                                                    </button>
                                                </div>
                                            </>,
                                            document.body
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-[var(--color-error-light)] border border-[var(--color-error-lighter)] rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-[var(--color-error-dark)]">
                            <HelpCircle size={16} />
                            <span className="font-medium">Error:</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Filters Card */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-5 md:p-6 mb-8">
                    {/* Card Header */}
                    <div className="flex items-start md:items-center gap-3 mb-5">
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-lg">
                            <Filter className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)]">Report Filters</h2>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-gray-light)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    {dropdownLoading && (
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)]">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading filter options...</span>
                        </div>
                    )}

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {/* Month Year */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Month &amp; Year <span className="text-[var(--color-text-secondary)]">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <DatePicker
                                    selected={filters.month_year ? new Date(`${filters.month_year}-01`) : null}
                                    onChange={(date) => {
                                        const iso = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';
                                        handleFilterChange('month_year', iso);
                                    }}
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                                    placeholderText="Select month and year"
                                    maxDate={new Date()}
                                    showPopperArrow={false}
                                />
                            </div>
                        </div>

                        {/* Branch */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Building className="inline h-4 w-4 mr-1" />
                                Branch
                            </label>
                            <select
                                value={filters.branch_id}
                                onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Department
                            </label>
                            <select
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Departments</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Award className="inline h-4 w-4 mr-1" />
                                Designation
                            </label>
                            <select
                                value={filters.designation_id}
                                onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Designations</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>
                                        {designation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Employee (optional) */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Employee <span className="text-[var(--color-text-secondary)]">(optional)</span>
                            </label>
                            <SearchableDropdown
                                options={employees}
                                value={filters.employee_id}
                                onChange={(value) => handleFilterChange('employee_id', value)}
                                placeholder="Search and select employee..."
                                disabled={dropdownLoading}
                                displayKey="name"
                                valueKey="id"
                            />
                        </div>

                        {/* Generate */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-transparent mb-2">Generate</label>
                            <button
                                onClick={handleGenerateReport}
                                disabled={loading || !filters.month_year}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${loading || !filters.month_year
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue-dark)] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Generate Report
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Data Preview Section - Wrapped in better container like MonthlyMusterPreview */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden mb-8">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                                    Monthly Attendance Report - {formatMonthYear(filters.month_year)}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {hasGenerated
                                        ? `${reportData.length} record${reportData.length !== 1 ? 's' : ''} found`
                                        : 'Click "Generate Report" to load data'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="relative h-1 bg-[var(--color-bg-gray-light)]">
                            <div className="absolute inset-y-0 left-0 bg-[var(--color-blue)] animate-pulse w-1/3" />
                        </div>
                    )}

                    {/* Data Table Container */}
                    <div className="overflow-auto max-h-[70vh]">
                        {/* Empty state - show different messages based on state */}
                        {!hasGenerated && !loading && (
                            <div className="p-12 text-center">
                                <div className="text-[var(--color-text-muted)] mb-4">
                                    <Calendar size={64} className="mx-auto" />
                                </div>
                                <p className="text-[var(--color-text-primary)] font-medium text-lg mb-2">Ready to Generate Report</p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Select your filters and click "Generate Report" to view attendance data
                                </p>
                            </div>
                        )}

                        {hasGenerated && reportData.length === 0 && !loading && (
                            <div className="p-8 text-center">
                                <div className="text-[var(--color-text-muted)] mb-2">
                                    <Users size={48} className="mx-auto" />
                                </div>
                                <p className="text-[var(--color-text-secondary)] font-medium">No attendance data found</p>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                    Try adjusting your filters or select a different month
                                </p>
                            </div>
                        )}

                        {/* Data Table - only show when data is available */}
                        {hasGenerated && reportData.length > 0 && (
                            <div className="overflow-auto max-h-[70vh] border border-[var(--color-border-secondary)] rounded-lg">
                                <table className="w-full border-collapse table-fixed">
                                    <thead>
                                        <tr className="sticky top-0 bg-[var(--color-bg-surface)] border-b-2 border-[var(--color-border-primary)] z-20">
                                            <th className="w-60 px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] 
                    sticky top-0 left-0 z-30 bg-[var(--color-bg-surface)] border-r-2 border-[var(--color-border-primary)] shadow-lg">
                                                Employee Details
                                            </th>
                                            {Array.from({
                                                length: getDaysInMonth(
                                                    parseInt(filters.month_year.slice(0, 4)),
                                                    parseInt(filters.month_year.slice(5, 7))
                                                )
                                            }, (_, i) => (
                                                <th key={i + 1} className="w-28 px-2 py-3 text-center text-sm font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border-secondary)]">
                                                    {i + 1}
                                                </th>
                                            ))}
                                            <th className="w-40 px-3 py-3 text-center text-sm font-semibold text-[var(--color-text-primary)] 
                    sticky top-0 z-30 bg-[var(--color-bg-surface)] border-l-2 border-[var(--color-border-primary)] shadow-lg">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reportData.map((employee, index) => {
                                            const employeeTotals = { P: 0, A: 0, L: 0, WO: 0, '½P': 0, H: 0, totalHours: 0 };
                                            const normalizeStatus = (status) => {
                                                if (!status) return null;
                                                switch (status) {
                                                    case "1/2P":
                                                    case "HalfP":
                                                    case "Half Day":
                                                        return "½P";
                                                    default:
                                                        return status;
                                                }
                                            };

                                            Object.values(employee.dailyAttendance).forEach(record => {
                                                const normalizedStatus = normalizeStatus(record.short_status || record.status);
                                                if (normalizedStatus) employeeTotals[normalizedStatus] = (employeeTotals[normalizedStatus] || 0) + 1;
                                                if (record.totalHours) {
                                                    const hours = record.totalHours.match(/(\d+)h/);
                                                    const minutes = record.totalHours.match(/(\d+)m/);
                                                    if (hours) employeeTotals.totalHours += parseInt(hours[1]);
                                                    if (minutes) employeeTotals.totalHours += parseInt(minutes[1]) / 60;
                                                }
                                            });

                                            return (
                                                <tr key={index} className="border-b border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                                    <td className="w-60 px-4 py-3 text-sm sticky left-0 bg-[var(--color-bg-card)] border-r-2 border-[var(--color-border-primary)] shadow-md">
                                                        <div className="min-h-[70px] flex flex-col justify-center">
                                                            <div className="font-semibold text-[var(--color-text-primary)] text-base leading-tight">{employee.employee_name}</div>
                                                            <div className="text-sm text-[var(--color-text-secondary)] mt-1">{employee.employee_code}</div>
                                                        </div>
                                                    </td>

                                                    {Array.from({ length: getDaysInMonth(parseInt(filters.month_year.slice(0, 4)), parseInt(filters.month_year.slice(5, 7))) }, (_, dayIndex) => {
                                                        const day = dayIndex + 1;
                                                        const dailyRecord = employee.dailyAttendance[day];
                                                        return (
                                                            <td key={day} className="w-50 px-2 py-3 text-center border-r border-[var(--color-border-secondary)]">
                                                                {dailyRecord ? (
                                                                    <div className="h-[72px] border-t-2 border-l-2 border-r-2 border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] rounded-md p-1.5 flex flex-col justify-between text-xs shadow-sm ">
                                                                        <div className="flex flex-col mb-1">
                                                                            <div className="flex justify-between gap-1 items-center">
                                                                                <span className="text-[9px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary-20)] px-1 py-0.5 rounded leading-none">
                                                                                    {dailyRecord.inTime || '--'}
                                                                                </span>
                                                                                <span className="text-[9px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary-20)] px-1 py-0.5 rounded leading-none">
                                                                                    {dailyRecord.outTime || '--'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-center flex-1 flex items-center justify-center">
                                                                            <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold shadow-sm ${getStatusColor(dailyRecord.status)}`}>
                                                                                {dailyRecord.status}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-[10px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)]text-center px-1 py-1 rounded leading-none mb-2">
                                                                            {dailyRecord.totalHours || '0h 0m'}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-[70px] border-2 border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary-30)] rounded-md flex items-center justify-center">
                                                                        <span className="text-[var(--color-text-muted)] text-sm font-medium">--</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}

                                                    <td className="w-40 px-3 py-3 text-center right-0 z-20 bg-[var(--color-bg-card)] border-l-2 border-[var(--color-border-primary)] shadow-md">
                                                        <div className="h-[70px] bg-[var(--color-bg-secondary-20)] border-2 border-[var(--color-border-secondary)] rounded-md p-2 flex flex-col justify-center space-y-1">
                                                            <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
                                                                {employeeTotals.P > 0 && <div className="bg-[var(--color-cell-p-bg)] text-[var(--color-cell-p-text)] border-l-4 border-l-[var(--color-cell-p-border)] px-1 rounded">P:{employeeTotals.P}</div>}
                                                                {employeeTotals.A > 0 && <div className="bg-[var(--color-cell-a-bg)] text-[var(--color-cell-a-text)] border-l-4 border-l-[var(--color-cell-a-border)] px-1 rounded">A:{employeeTotals.A}</div>}
                                                                {employeeTotals.L > 0 && <div className="bg-[var(--color-cell-l-bg)] text-[var(--color-cell-l-text)] border-l-4 border-l-[var(--color-cell-l-border)] px-1 rounded">L:{employeeTotals.L}</div>}
                                                                {employeeTotals.WO > 0 && <div className="bg-[var(--color-cell-wo-bg)] text-[var(--color-cell-wo-text)] border-l-4 border-l-[var(--color-cell-wo-border)] px-1 rounded">WO:{employeeTotals.WO}</div>}
                                                                {employeeTotals['½P'] > 0 && <div className="bg-[var(--color-cell-halfp-bg)] text-[var(--color-cell-halfp-text)] border-l-4 border-l-[var(--color-cell-halfp-border)] px-1 rounded">½P:{employeeTotals['½P']}</div>}
                                                                {employeeTotals.H > 0 && <div className="bg-[var(--color-cell-h-bg)] text-[var(--color-cell-h-text)] border-l-4 border-l-[var(--color-cell-h-border)] px-1 rounded">H:{employeeTotals.H}</div>}
                                                            </div>
                                                            <div className="text-xs font-bold text-[var(--color-text-blue)] pt-1 mt-1 border-t border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary-20)] px-2 py-1 rounded">
                                                                {Math.floor(employeeTotals.totalHours)}h {Math.round((employeeTotals.totalHours % 1) * 60)}m
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );
};

export default MonthlyReport;