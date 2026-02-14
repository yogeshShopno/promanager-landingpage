import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Calendar,
  IndianRupee,
  RefreshCw,
  XCircle,
  FileText,
  ArrowLeft,
  Clock,
  TrendingUp,
  Edit,
  Save,
  X,
  Calendar as CalendarIcon,
  Plus,
  Minus,
  CheckCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmDialog } from '../../Components/ui/ConfirmDialog';
import LoadingSpinner from '../../Components/Loader/LoadingSpinner';

const MonthlyPayroll = () => {
  // basic UI/filter state
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [expandedShiftId, setExpandedShiftId] = useState(null);

  // salary pieces
  const [baseSalary, setBaseSalary] = useState('0');
  const [monthlySalary, setMonthlySalary] = useState('0');

  // allowances/deductions
  const [selectedAllowances, setSelectedAllowances] = useState({});
  const [editableAllowances, setEditableAllowances] = useState({});
  const [editingAllowanceId, setEditingAllowanceId] = useState(null);

  const [selectedDeductions, setSelectedDeductions] = useState({});
  const [editableDeductions, setEditableDeductions] = useState({});
  const [editingDeductionId, setEditingDeductionId] = useState(null);

  // holidays (compact)
  const [groupedHolidays, setGroupedHolidays] = useState([]); // [{ holiday_id, holiday_name, dates: [...] }]
  const [selectedHolidays, setSelectedHolidays] = useState({}); // holiday_id => bool
  const [editableHolidayAmounts, setEditableHolidayAmounts] = useState({}); // holiday_date_id => string
  const [editingHolidayDateId, setEditingHolidayDateId] = useState(null);
  const [expandedHolidayId, setExpandedHolidayId] = useState(null);

  // loans & advances
  const [selectedLoans, setSelectedLoans] = useState({});
  const [selectedAdvances, setSelectedAdvances] = useState({});
  const [editableAdvances, setEditableAdvances] = useState({});
  const [editingAdvanceId, setEditingAdvanceId] = useState(null);

  // final payable editable
  const [finalPayableManuallyEdited, setFinalPayableManuallyEdited] = useState(false);
  const [isEditingFinalPayable, setIsEditingFinalPayable] = useState(false);
  const [editableFinalPayable, setEditableFinalPayable] = useState('');

  // remark
  const [hasAnyEdit, setHasAnyEdit] = useState(false);
  const [editRemark, setEditRemark] = useState('');

  // toasts & confirm
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });

  const navigate = useNavigate();
  const permissions = useSelector(state => state.permissions) || {};
  const { user, isAuthenticated, logout } = useAuth();

  // constants
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // helpers
  const showToast = (message, type) => setToast({ message, type });
  const closeToast = () => setToast(null);

  // group holiday list by holiday_id (keeps order)
  const groupHolidaysById = (arr = []) => {
    const map = {};
    arr.forEach(h => {
      const id = h.holiday_id;
      if (!map[id]) map[id] = { holiday_id: id, holiday_name: h.holiday_name, dates: [] };
      map[id].dates.push({
        holiday_date_id: h.holiday_date_id,
        holiday_date: h.holiday_date,
        holiday_paid: `${h.holiday_paid}`, // ensure string
        holiday_amount: `${h.holiday_amount || '0'}`
      });
    });
    return Object.values(map);
  };

  // fetch employees (same API)
  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true); // Add this line
      setLoading(true);
      setError(null);
      if (!user?.user_id) throw new Error('User ID is required');
      const formData = new FormData();
      formData.append('user_id', user.user_id);
      const response = await api.post('assign_shift_list_drop_down', formData);
      if (response.data?.success) {
        setEmployees(response.data.data?.employee_list || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch employees');
      }
    } catch (err) {
      console.error('fetchEmployees', err);
      const msg = err.response?.data?.message || err.message || 'Unexpected error';
      if (err.response?.status === 401) {
        showToast('Session expired. Logging out...', 'error');
        setTimeout(() => logout?.(), 1500);
      } else {
        showToast(msg, 'error');
        setError(msg);
      }
    } finally {
      setLoadingEmployees(false); // Add this line
      setLoading(false);
    }
  }, [user, logout]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = event.target.closest('.relative');
      if (!dropdown) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // generate payroll (same endpoint)
  const handleGeneratePayroll = useCallback(async () => {
    if (!selectedEmployee || !selectedMonth || !selectedYear) {
      const m = 'Please select employee, month, and year';
      showToast(m, 'error'); setError(m); return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('employee_id', selectedEmployee);
      formData.append('month_year', `${selectedYear}-${selectedMonth}`);
      const response = await api.post('employee_wise_search_salary', formData);

      if (!response.data?.success) throw new Error(response.data?.message || 'Failed to fetch payroll data');

      const data = response.data.data;
      setPayrollData(data);

      // salary values
      setMonthlySalary(data.monthly_salary || data.salary || '0');
      setBaseSalary(data.total_salary || '0');

      // allowances
      const initSelectedAllowances = {};
      const initEditableAllowances = {};
      data.employee_allowance_arr?.forEach(a => {
        initSelectedAllowances[a.employee_allowance_id] = true;
        initEditableAllowances[a.employee_allowance_id] = a.allowance_amount;
      });
      setSelectedAllowances(initSelectedAllowances);
      setEditableAllowances(initEditableAllowances);

      // deductions
      const initSelectedDeductions = {};
      const initEditableDeductions = {};
      data.employee_deduction_arr?.forEach(d => {
        initSelectedDeductions[d.employee_deduction_id] = true;
        initEditableDeductions[d.employee_deduction_id] = d.deduction_amount;
      });
      setSelectedDeductions(initSelectedDeductions);
      setEditableDeductions(initEditableDeductions);

      // holidays grouped
      const grouped = groupHolidaysById(data.holiday_list_arr || []);
      setGroupedHolidays(grouped);

      // loans - default all selected (read-only amounts)
      const initSelectedLoans = {};
      data.employee_loan_arr?.forEach(loan => {
        initSelectedLoans[loan.loan_items_id] = true;
      });
      setSelectedLoans(initSelectedLoans);

      // advances - default all selected with editable amounts
      const initSelectedAdvances = {};
      const initEditableAdvances = {};
      data.employee_advance_arr?.forEach(adv => {
        initSelectedAdvances[adv.advance_id] = true;
        initEditableAdvances[adv.advance_id] = adv.advance_amount;
      });
      setSelectedAdvances(initSelectedAdvances);
      setEditableAdvances(initEditableAdvances);

      // default selections & editable amounts
      const initSelectedH = {};
      const initEditableHolidayAmounts = {};
      grouped.forEach(g => {
        // default: include group if there is any paid date in it
        const anyPaid = g.dates.some(d => d.holiday_paid === '1');
        initSelectedH[g.holiday_id] = anyPaid; // include paid groups by default
        g.dates.forEach(d => {
          initEditableHolidayAmounts[d.holiday_date_id] = (d.holiday_paid === '1') ? d.holiday_amount || '0' : '0';
        });
      });
      setSelectedHolidays(initSelectedH);
      setEditableHolidayAmounts(initEditableHolidayAmounts);

      // initial final payable calculation
      const paySalary = parseFloat(data.pay_salary || '0');
      const totalAllowances = Object.values(initEditableAllowances).reduce((s, x) => s + (parseFloat(x || 0) || 0), 0);
      const totalDeductions = Object.values(initEditableDeductions).reduce((s, x) => s + (parseFloat(x || 0) || 0), 0);
      // holiday total only for paid dates
      const totalHolidays = (data.holiday_list_arr || []).reduce((s, h) => s + ((h.holiday_paid === '1') ? parseFloat(h.holiday_amount || 0) : 0), 0);
      // Replace the existing initialFinal calculation with:
      const totalLoans = (data.employee_loan_arr || []).reduce((s, l) => s + parseFloat(l.installment_amount || 0), 0);
      const totalAdvances = Object.values(initEditableAdvances).reduce((s, x) => s + (parseFloat(x || 0) || 0), 0);
      const initialFinal = paySalary + totalAllowances - totalDeductions + totalHolidays - totalLoans - totalAdvances;
      setEditableFinalPayable(initialFinal.toString());
      setFinalPayableManuallyEdited(false);



      showToast('Payroll data generated successfully', 'success');
    } catch (err) {
      console.error('generate payroll', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load payroll data';
      showToast(msg, 'error');
      setPayrollData(null);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [selectedEmployee, selectedMonth, selectedYear, user]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) {
      return employees; // Show all employees when search is empty
    }
    return employees.filter(emp =>
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // --- Calculations (memoized) ---
  const overtimeAndWeekoff = useMemo(() => {
    if (!payrollData?.main_attendance_arr) return { totalOvertimeHours: 0, overtimePay: 0, weekoffPay: 0 };
    let totalOvertime = 0, overtimePay = 0;
    payrollData.main_attendance_arr.forEach(s => s.attendance_arr?.forEach(a => {
      totalOvertime += parseFloat(a.overtime || 0) || 0;
      overtimePay += parseFloat(a.overtime_salary_for_day || 0) || 0;
    }));
    return { totalOvertimeHours: totalOvertime, overtimePay, weekoffPay: parseFloat(payrollData.week_of_salary || 0) || 0 };
  }, [payrollData]);

  const paySalary = useMemo(() => {
    return (parseFloat(baseSalary || 0) || 0) + (overtimeAndWeekoff.overtimePay || 0) + (overtimeAndWeekoff.weekoffPay || 0);
  }, [baseSalary, overtimeAndWeekoff]);

  const totalAllowances = useMemo(() => {
    return Object.keys(selectedAllowances).reduce((s, id) => s + ((selectedAllowances[id]) ? (parseFloat(editableAllowances[id] || 0) || 0) : 0), 0);
  }, [selectedAllowances, editableAllowances]);

  const totalDeductions = useMemo(() => {
    return Object.keys(selectedDeductions).reduce((s, id) => s + ((selectedDeductions[id]) ? (parseFloat(editableDeductions[id] || 0) || 0) : 0), 0);
  }, [selectedDeductions, editableDeductions]);

  const totalHolidays = useMemo(() => {
    // include only dates whose group is selected AND holiday_paid === '1'
    let s = 0;
    groupedHolidays.forEach(g => {
      if (!selectedHolidays[g.holiday_id]) return;
      g.dates.forEach(d => {
        if (d.holiday_paid === '1') s += parseFloat(editableHolidayAmounts[d.holiday_date_id] || 0) || 0;
      });
    });
    return s;
  }, [groupedHolidays, selectedHolidays, editableHolidayAmounts]);
  const totalLoans = useMemo(() => {
    if (!payrollData?.employee_loan_arr) return 0;
    return payrollData.employee_loan_arr.reduce((s, loan) => {
      return s + (selectedLoans[loan.loan_items_id] ? (parseFloat(loan.installment_amount || 0) || 0) : 0);
    }, 0);
  }, [payrollData, selectedLoans]);

  const totalAdvances = useMemo(() => {
    return Object.keys(selectedAdvances).reduce((s, id) => {
      return s + (selectedAdvances[id] ? (parseFloat(editableAdvances[id] || 0) || 0) : 0);
    }, 0);
  }, [selectedAdvances, editableAdvances]);

  // auto recalc final payable when components change
  useEffect(() => {
    const auto = paySalary + totalAllowances - totalDeductions + totalHolidays - totalLoans - totalAdvances;
    // Don't overwrite when user is editing OR when it was manually edited
    if (!isEditingFinalPayable && !finalPayableManuallyEdited) {
      setEditableFinalPayable(auto.toString());
    }
  }, [paySalary, totalAllowances, totalDeductions, totalHolidays, totalLoans, totalAdvances, isEditingFinalPayable, finalPayableManuallyEdited]);

  // --- Handlers: allowances/deductions/hotidays edits ---
  const toggleAllowance = (id) => {
    setSelectedAllowances(prev => ({ ...prev, [id]: !prev[id] }));
    setHasAnyEdit(true);
  };
  const saveAllowance = (id) => {
    const amt = parseFloat(editableAllowances[id]);
    if (isNaN(amt) || amt < 0) return showToast('Please enter a valid amount', 'error');
    setEditingAllowanceId(null);
    setHasAnyEdit(true);
    showToast('Allowance saved', 'success');
  };

  const toggleDeduction = (id) => {
    setSelectedDeductions(prev => ({ ...prev, [id]: !prev[id] }));
    setHasAnyEdit(true);
  };
  const saveDeduction = (id) => {
    const amt = parseFloat(editableDeductions[id]);
    if (isNaN(amt) || amt < 0) return showToast('Please enter a valid amount', 'error');
    setEditingDeductionId(null);
    setHasAnyEdit(true);
    showToast('Deduction saved', 'success');
  };

  // holiday handlers
  const toggleHolidayGroup = (holidayId) => {
    setSelectedHolidays(prev => ({ ...prev, [holidayId]: !prev[holidayId] }));
    setHasAnyEdit(true);
  };
  const toggleExpandHoliday = (holidayId) => setExpandedHolidayId(prev => (prev === holidayId ? null : holidayId));

  const startEditHolidayDate = (dateId) => {
    setEditingHolidayDateId(dateId);
  };
  const saveHolidayDate = (dateId, holidayPaid) => {
    if (holidayPaid === '2') {
      // unpaid -> always zero
      setEditableHolidayAmounts(prev => ({ ...prev, [dateId]: '0' }));
      setEditingHolidayDateId(null);
      return;
    }
    const amt = parseFloat(editableHolidayAmounts[dateId]);
    if (isNaN(amt) || amt < 0) return showToast('Please enter a valid amount', 'error');
    setEditingHolidayDateId(null);
    setHasAnyEdit(true);
    showToast('Holiday amount updated', 'success');
  };

  // Loan handlers
  const toggleLoan = (itemsId) => {
    setSelectedLoans(prev => ({ ...prev, [itemsId]: !prev[itemsId] }));
    setHasAnyEdit(true);
  };

  // Advance handlers
  const toggleAdvance = (id) => {
    setSelectedAdvances(prev => ({ ...prev, [id]: !prev[id] }));
    setHasAnyEdit(true);
  };

  const saveAdvance = (id) => {
    const originalAmount = payrollData.employee_advance_arr?.find(a => a.advance_id === id)?.advance_amount || '0';
    const editedAmount = parseFloat(editableAdvances[id]);
    const maxAmount = parseFloat(originalAmount);

    if (isNaN(editedAmount) || editedAmount < 0) {
      return showToast('Please enter a valid amount', 'error');
    }
    if (editedAmount > maxAmount) {
      return showToast(`Amount cannot exceed ₹${maxAmount.toLocaleString()}`, 'error');
    }

    setEditingAdvanceId(null);
    setHasAnyEdit(true);
    showToast('Advance amount updated', 'success');
  };

  // final payable handlers
  const handleSaveFinalPayable = () => {
    const amt = parseFloat(editableFinalPayable);
    if (isNaN(amt) || amt < 0) return showToast('Please enter a valid final amount', 'error');
    setIsEditingFinalPayable(false);
    setFinalPayableManuallyEdited(true); // Set flag when manually edited
    setHasAnyEdit(true);
    showToast('Final payable updated', 'success');
  };

  const handleCancelFinalPayableEdit = () => {
    setIsEditingFinalPayable(false);
    setFinalPayableManuallyEdited(false); // Reset flag on cancel
    // The useEffect will restore auto calc
  };

  // submit payroll - same endpoint
  const handleSubmitPayroll = () => {
    if (!payrollData) return showToast('No payroll data to submit', 'error');
    if (hasAnyEdit && !editRemark.trim()) return showToast('Please add a remark for edits', 'error');

    const employeeName = employees.find(e => e.employee_id === selectedEmployee)?.full_name || 'Unknown';
    const monthLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;
    setConfirmModal({
      isOpen: true,
      type: 'submit',
      data: {
        employeeName,
        month: monthLabel,
        year: selectedYear,
        baseSalary,
        paySalary: paySalary.toFixed(2),
        totalPaySalary: (parseFloat(editableFinalPayable || 0)).toFixed(2)
      }
    });
  };

  const confirmSubmitPayroll = async () => {
    try {
      setSubmitting(true);
      setConfirmModal({ isOpen: false, type: '', data: null });

      const formData = new FormData();
      const { overtimePay, weekoffPay } = overtimeAndWeekoff;

      formData.append('employee_id', selectedEmployee);
      formData.append('user_id', user.user_id);
      formData.append('month_year', `${selectedYear}-${selectedMonth}`);

      formData.append('total_salary', baseSalary);
      formData.append('overtime_salary', (overtimePay || 0).toString());
      formData.append('week_of_salary', (weekoffPay || 0).toString());
      formData.append('pay_salary', (paySalary || 0).toString());
      formData.append('total_pay_salary', (parseFloat(editableFinalPayable || 0) || 0).toString());

      formData.append('main_attendance_arr', JSON.stringify(payrollData.main_attendance_arr || []));

      const selectedAllowancesList = payrollData.employee_allowance_arr
        ?.filter(a => selectedAllowances[a.employee_allowance_id])
        .map(a => ({ ...a, allowance_amount: editableAllowances[a.employee_allowance_id] })) || [];
      formData.append('employee_allowance_arr', JSON.stringify(selectedAllowancesList));

      const selectedDeductionsList = payrollData.employee_deduction_arr
        ?.filter(d => selectedDeductions[d.employee_deduction_id])
        .map(d => ({ ...d, deduction_amount: editableDeductions[d.employee_deduction_id] })) || [];
      formData.append('employee_deduction_arr', JSON.stringify(selectedDeductionsList));

      // Build employee_holiday_arr: include only dates which belong to selected holiday groups.
      const employeeHolidayArr = [];
      groupedHolidays.forEach(group => {
        if (!selectedHolidays[group.holiday_id]) return;
        group.dates.forEach(d => {
          // holiday_paid: '1' paid, '2' unpaid -> unpaid amount forced to '0'
          const amount = (d.holiday_paid === '1') ? (editableHolidayAmounts[d.holiday_date_id] || '0') : '0';
          employeeHolidayArr.push({
            holiday_id: group.holiday_id,
            holiday_name: group.holiday_name,
            holiday_date_id: d.holiday_date_id,
            holiday_date: d.holiday_date,
            holiday_paid: d.holiday_paid,
            holiday_amount: amount
          });
        });
      });
      formData.append('employee_holiday_arr', JSON.stringify(employeeHolidayArr));

      const selectedLoansList = payrollData.employee_loan_arr
        ?.filter(l => selectedLoans[l.loan_items_id])
        .map(l => ({ ...l })) || [];
      formData.append('employee_loan_arr', JSON.stringify(selectedLoansList));

      const selectedAdvancesList = payrollData.employee_advance_arr
        ?.filter(a => selectedAdvances[a.advance_id])
        .map(a => ({ ...a, advance_amount: editableAdvances[a.advance_id] })) || [];
      formData.append('employee_advance_arr', JSON.stringify(selectedAdvancesList));

      if (hasAnyEdit && editRemark.trim()) formData.append('remark_for_edit', editRemark.trim());

      const response = await api.post('add_monthly_employee_salary', formData);
      if (response.data?.success) {
        showToast('Payroll submitted successfully', 'success');
        // reset
        setPayrollData(null);
        setSelectedEmployee('');
        setSearchTerm('');
        setBaseSalary('0');
        setMonthlySalary('0');
        setEditableFinalPayable('');
        setFinalPayableManuallyEdited(false);
        setIsEditingFinalPayable(false);
        setSelectedAllowances({});
        setEditableAllowances({});
        setSelectedDeductions({});
        setEditableDeductions({});
        setHasAnyEdit(false);
        setEditRemark('');
        setSelectedLoans({});
        setSelectedAdvances({});
        setEditableAdvances({});
        setEditingAdvanceId(null);
        setGroupedHolidays([]);
        setSelectedHolidays({});
        setEditableHolidayAmounts({});
        setEditingHolidayDateId(null);
        setExpandedHolidayId(null);
      } else {
        throw new Error(response.data?.message || 'Failed to submit payroll');
      }
    } catch (err) {
      console.error('submit payroll', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit payroll';
      if (err.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        setTimeout(() => logout?.(), 1500);
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // UI helpers & init
  useEffect(() => {
    if (isAuthenticated() && user?.user_id) {
      fetchEmployees();
      const now = new Date();
      setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'));
      setSelectedYear(String(currentYear));
    }
  }, [isAuthenticated, fetchEmployees, user?.user_id]);

  useEffect(() => {
    if (error && (selectedEmployee || selectedMonth || selectedYear)) setError(null);
  }, [selectedEmployee, selectedMonth, selectedYear, error]);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  if (!permissions['salary_view']) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-8 text-center">
            <XCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-error-dark)] mb-2">Access Denied</h3>
            <p className="text-[var(--color-text-error)] mb-4">You don't have permission to access payroll data.</p>
            <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-md hover:bg-[var(--color-error-lighter)] transition-colors">
              <ArrowLeft className="w-4 h-4" /> <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }


  // display totals
  const finalPayable = parseFloat(editableFinalPayable || 0);

  // compact UI render
  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6 rounded-2xl shadow-xl mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--color-text-white)] px-3 py-2 rounded-lg bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)]">
                <ArrowLeft size={18} /> Back
              </button>
              <h1 className="text-2xl font-bold text-[var(--color-text-white)]">Monthly Payroll</h1>
            </div>
          </div>

          <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                <h3 className="text-lg font-medium text-[var(--color-text-white)]">Payroll Generation</h3>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    <Users className="w-4 h-4 inline mr-2" /> Select Employee
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employee by name or ID..."
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setIsDropdownOpen(true);
                      }}
                      onClick={() => {
                        setSearchTerm('');
                        setIsDropdownOpen(true);
                      }}
                      className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={loading || loadingEmployees}
                    />

                    {/* Loading spinner inside input */}
                    {loadingEmployees && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-blue-dark)]" />
                      </div>
                    )}

                    {isDropdownOpen && !loadingEmployees && (
                      <div className="absolute z-10 w-full mt-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map(emp => (
                            <div
                              key={emp.employee_id}
                              onClick={() => {
                                setSelectedEmployee(emp.employee_id);
                                setSearchTerm(emp.full_name);
                                setIsDropdownOpen(false);
                                // reset states for fresh generation
                                setPayrollData(null);
                                setBaseSalary('0');
                                setMonthlySalary('0');
                                setEditableFinalPayable('');
                                setSelectedAllowances({});
                                setEditableAllowances({});
                                setSelectedDeductions({});
                                setEditableDeductions({});
                                setGroupedHolidays([]);
                                setSelectedHolidays({});
                                setEditableHolidayAmounts({});
                                setHasAnyEdit(false);
                                setEditRemark('');
                              }}
                              className="px-4 py-2 hover:bg-[var(--color-blue-lightest)] cursor-pointer border-b last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-[var(--color-text-primary)]">{emp.full_name}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No employees found</p>
                            <p className="text-xs mt-1">Try a different search term</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Loading state in dropdown */}
                    {isDropdownOpen && loadingEmployees && (
                      <div className="absolute z-10 w-full mt-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg shadow-lg">
                        <div className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-[var(--color-blue-dark)]" />
                          <p>Loading employees...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"><Calendar className="w-4 h-4 inline mr-2" /> Month</label>
                  <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg" disabled={loading}>
                    <option value="">Choose Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"><Calendar className="w-4 h-4 inline mr-2" /> Year</label>
                  <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg" disabled={loading}>
                    <option value="">Choose Year</option>
                    {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleGeneratePayroll} disabled={submitting || !selectedEmployee || !selectedMonth || !selectedYear} className="px-6 py-2 bg-[var(--color-blue-dark)] hover:bg-[var(--color-blue-darker)] text-white rounded-lg flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> {submitting ? 'Generating...' : 'Generate Payroll'}
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? <div className="p-6"><LoadingSpinner /></div> : error ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-6">
                  <XCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
                  <p className="text-[var(--color-error-dark)] text-lg font-medium mb-2">Error</p>
                  <p className="text-[var(--color-text-error)] mb-4">{error}</p>
                  <button onClick={fetchEmployees} className="inline-flex items-center space-x-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-md hover:bg-[var(--color-error-lighter)]">
                    <RefreshCw className="w-4 h-4" /> <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : !payrollData ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg p-8">
                  <div className="w-16 h-16 bg-[var(--color-bg-gray-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No Payroll Data</p>
                  <p className="text-[var(--color-text-secondary)] text-sm">Select employee, month and year then click Generate Payroll.</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Top summary cards (compact) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-200 rounded-lg"><CalendarIcon className="w-5 h-5 text-purple-700" /></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-700">Monthly Salary</p>
                        <p className="text-lg font-bold text-purple-900">₹{parseFloat(monthlySalary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-blue-lightest)] rounded-lg p-4 border border-[var(--color-blue-light)]">
                    <div className="flex items-center">
                      <div className="p-2 bg-[var(--color-blue-lighter)] rounded-lg"><IndianRupee className="w-5 h-5 text-[var(--color-blue-dark)]" /></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-blue-dark)]">Base Salary</p>
                        <p className="text-lg font-bold text-[var(--color-blue-dark)]">₹{parseFloat(baseSalary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-200 rounded-lg"><Clock className="w-5 h-5 text-blue-700" /></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-700">Overtime <span className="text-xs">({overtimeAndWeekoff.totalOvertimeHours.toFixed(2)}h)</span></p>
                        <p className="text-lg font-bold text-blue-900">₹{overtimeAndWeekoff.overtimePay.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-cell-p-bg)] rounded-lg p-4 border border-[var(--color-cell-p-border)]">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg"><CalendarIcon className="w-5 h-5 text-[var(--color-cell-p-text)]" /></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-cell-p-text)]">Week-off Pay</p>
                        <p className="text-lg font-bold text-[var(--color-cell-p-text)]">₹{overtimeAndWeekoff.weekoffPay.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-cell-wo-bg)] rounded-lg p-4 border border-[var(--color-cell-wo-border)]">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-[var(--color-cell-wo-text)]" /></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-cell-wo-text)]">Pay Salary</p>
                        <p className="text-lg font-bold text-[var(--color-cell-wo-text)]">₹{paySalary.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance (unchanged) */}
                {/* Attendance (Accordion) */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Attendance Details
                    </h3>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {payrollData.main_attendance_arr?.length || 0} Shift(s)
                    </div>
                  </div>

                  {payrollData.main_attendance_arr?.length === 0 ? (
                    <div className="text-center py-8 text-[var(--color-text-secondary)]">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No attendance records found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payrollData.main_attendance_arr?.map((shift, idx) => {
                        const isExpanded = expandedShiftId === idx;
                        const totalDays = shift.attendance_arr?.length || 0;
                        const presentDays = shift.attendance_arr?.filter(a =>
                          a.status_name === 'Complete hours' ||
                          a.status_name === 'Incomplete hours' ||
                          a.status_name === 'Overtime hours'
                        ).length || 0;

                        return (
                          <div
                            key={idx}
                            className="border border-[var(--color-border-primary)] rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                          >
                            {/* Accordion Header */}
                            <button
                              onClick={() => setExpandedShiftId(isExpanded ? null : idx)}
                              className="w-full px-4 py-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                  )}
                                </div>

                                <div className="text-left flex-1">
                                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                                    {shift.shift_name}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                                    <span className="flex items-center">
                                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                      {presentDays} / {totalDays} Days
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="w-4 h-4 mr-1" />
                                      Working Days: {shift.total_working_days}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right mr-4">
                                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Total Salary</div>
                                  <div className="text-xl font-bold text-[var(--color-blue-dark)]">
                                    ₹{parseFloat(shift.total_salary || 0).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* Accordion Content */}
                            {isExpanded && (
                              <div className="bg-white animate-fadeIn">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead className="bg-[var(--color-bg-secondary)]">
                                      <tr>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Date
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Status
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Working Hours
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          OT Hours
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Hourly Rate
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Daily Salary
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border-primary)]">
                                      {shift.attendance_arr?.map((a, i) => (
                                        <tr
                                          key={i}
                                          className="hover:bg-[var(--color-blue-lightest)] transition-colors"
                                        >
                                          <td className="px-4 py-3 text-center text-sm font-medium text-[var(--color-text-primary)]">
                                            {new Date(a.attendance_date).toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span
                                              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${a.status_name === 'Complete hours'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : a.status_name === 'Incomplete hours'
                                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                  : a.status_name === 'Overtime hours'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}
                                            >
                                              {a.status_name}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center text-sm font-medium">
                                            {a.actual_hours}
                                          </td>
                                          <td className="px-4 py-3 text-center text-sm font-medium text-blue-600">
                                            {a.overtime || '0'}
                                          </td>
                                          <td className="px-4 py-3 text-center text-sm">
                                            ₹{parseFloat(a.hourly_salary_for_day || 0).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-3 text-center text-sm">
                                            ₹{parseFloat(a.daily_salary_for_day || 0).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-3 text-center text-sm font-bold text-[var(--color-blue-dark)]">
                                            ₹{((parseFloat(a.daily_salary_for_day || 0) || 0) +
                                              (parseFloat(a.overtime_salary_for_day || 0) || 0)).toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot className="bg-[var(--color-blue-lightest)] border-t-2 border-[var(--color-blue-light)]">
                                      <tr>
                                        <td colSpan="5" className="px-4 py-3 text-right text-sm font-semibold text-[var(--color-text-primary)]">
                                          Shift Total:
                                        </td>
                                        <td colSpan="2" className="px-4 py-3 text-center text-lg font-bold text-[var(--color-blue-dark)]">
                                          ₹{parseFloat(shift.total_salary || 0).toLocaleString()}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Allowances & Deductions - Only show if data exists */}
                {(payrollData.employee_allowance_arr?.length > 0 || payrollData.employee_deduction_arr?.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Allowances - Only show if exists */}
                    {payrollData.employee_allowance_arr?.length > 0 && (
                      <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[var(--color-text-primary)]">Allowances</h3>
                          <div className="text-green-600 font-medium">+ ₹{totalAllowances.toLocaleString()}</div>
                        </div>
                        <div className="space-y-2">
                          {payrollData.employee_allowance_arr.map(a => (
                            <div key={a.employee_allowance_id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={!!selectedAllowances[a.employee_allowance_id]} onChange={() => toggleAllowance(a.employee_allowance_id)} className="w-4 h-4" />
                                <div>
                                  <div className="text-sm font-medium">{a.allowance_name}</div>
                                  <div className="text-xs text-[var(--color-text-secondary)]">Type {a.allowance_type}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {editingAllowanceId === a.employee_allowance_id ? (
                                  <>
                                    <input type="number" value={editableAllowances[a.employee_allowance_id] || '0'} onChange={e => setEditableAllowances(prev => ({ ...prev, [a.employee_allowance_id]: e.target.value }))} className="w-28 px-2 py-1 border rounded" min="0" step="0.01" />
                                    <button onClick={() => saveAllowance(a.employee_allowance_id)} className="p-1 text-green-600"><Save className="w-4 h-4" /></button>
                                    <button onClick={() => { setEditingAllowanceId(null); setEditableAllowances(prev => ({ ...prev, [a.employee_allowance_id]: a.allowance_amount })); }} className="p-1 text-gray-600"><X className="w-4 h-4" /></button>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-green-600">₹{parseFloat(editableAllowances[a.employee_allowance_id] || 0).toLocaleString()}</div>
                                    {permissions.salary_edit && selectedAllowances[a.employee_allowance_id] && <button onClick={() => { setEditingAllowanceId(a.employee_allowance_id); setEditableAllowances(prev => ({ ...prev, [a.employee_allowance_id]: a.allowance_amount })); }} className="p-1 text-[var(--color-text-secondary)]"><Edit className="w-4 h-4" /></button>}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deductions - Only show if exists */}
                    {payrollData.employee_deduction_arr?.length > 0 && (
                      <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[var(--color-text-primary)]">Deductions</h3>
                          <div className="text-red-600 font-medium">- ₹{totalDeductions.toLocaleString()}</div>
                        </div>
                        <div className="space-y-2">
                          {payrollData.employee_deduction_arr.map(d => (
                            <div key={d.employee_deduction_id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={!!selectedDeductions[d.employee_deduction_id]} onChange={() => toggleDeduction(d.employee_deduction_id)} className="w-4 h-4" />
                                <div>
                                  <div className="text-sm font-medium">{d.deduction_name}</div>
                                  <div className="text-xs text-[var(--color-text-secondary)]">Type {d.deduction_type}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {editingDeductionId === d.employee_deduction_id ? (
                                  <>
                                    <input type="number" value={editableDeductions[d.employee_deduction_id] || '0'} onChange={e => setEditableDeductions(prev => ({ ...prev, [d.employee_deduction_id]: e.target.value }))} className="w-28 px-2 py-1 border rounded" min="0" step="0.01" />
                                    <button onClick={() => saveDeduction(d.employee_deduction_id)} className="p-1 text-green-600"><Save className="w-4 h-4" /></button>
                                    <button onClick={() => { setEditingDeductionId(null); setEditableDeductions(prev => ({ ...prev, [d.employee_deduction_id]: d.deduction_amount })); }} className="p-1 text-gray-600"><X className="w-4 h-4" /></button>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-red-600">₹{parseFloat(editableDeductions[d.employee_deduction_id] || 0).toLocaleString()}</div>
                                    {permissions.salary_edit && selectedDeductions[d.employee_deduction_id] && <button onClick={() => { setEditingDeductionId(d.employee_deduction_id); setEditableDeductions(prev => ({ ...prev, [d.employee_deduction_id]: d.deduction_amount })); }} className="p-1 text-[var(--color-text-secondary)]"><Edit className="w-4 h-4" /></button>}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Holidays - Only show if data exists */}
                {groupedHolidays.length > 0 && (
                  <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">Holidays</h3>
                      <div className="text-green-700 font-medium">+ ₹{totalHolidays.toLocaleString()}</div>
                    </div>

                    <div className="space-y-3">
                      {groupedHolidays.map(g => {
                        const groupTotal = g.dates.reduce((s, d) => s + ((d.holiday_paid === '1') ? (parseFloat(editableHolidayAmounts[d.holiday_date_id] || 0) || 0) : 0), 0);
                        const included = !!selectedHolidays[g.holiday_id];
                        const groupHasAnyPaid = g.dates.some(d => d.holiday_paid === '1');
                        return (
                          <div key={g.holiday_id} className="p-3 border rounded bg-[var(--color-bg-secondary)]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={included} onChange={() => toggleHolidayGroup(g.holiday_id)} className="w-4 h-4" />
                                <div>
                                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{g.holiday_name} <span className="text-xs text-[var(--color-text-secondary)]">({g.dates.length} days)</span></div>
                                  <div className="text-xs text-[var(--color-text-secondary)]">{groupHasAnyPaid ? 'Contains Paid dates' : 'All Unpaid'}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="font-semibold">₹{groupTotal.toLocaleString()}</div>
                                <button onClick={() => toggleExpandHoliday(g.holiday_id)} className="p-1 rounded hover:bg-[var(--color-bg-gray-light)]">
                                  {expandedHolidayId === g.holiday_id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {expandedHolidayId === g.holiday_id && (
                              <div className="mt-3 pl-8 space-y-2">
                                {g.dates.map(d => (
                                  <div key={d.holiday_date_id} className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                      <div className="text-sm font-medium">{new Date(d.holiday_date).toLocaleDateString('en-GB')}</div>
                                      <div className="text-xs text-[var(--color-text-secondary)]">{d.holiday_paid === '1' ? 'Paid' : 'Unpaid'}</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {editingHolidayDateId === d.holiday_date_id ? (
                                        <>
                                          <input type="number" value={editableHolidayAmounts[d.holiday_date_id] || '0'} onChange={e => setEditableHolidayAmounts(prev => ({ ...prev, [d.holiday_date_id]: e.target.value }))} className="w-28 px-2 py-1 border rounded" min="0" step="0.01" />
                                          <button onClick={() => saveHolidayDate(d.holiday_date_id, d.holiday_paid)} className="p-1 text-green-600"><Save className="w-4 h-4" /></button>
                                          <button onClick={() => { setEditingHolidayDateId(null); setEditableHolidayAmounts(prev => ({ ...prev, [d.holiday_date_id]: d.holiday_paid === '1' ? d.holiday_amount : '0' })); }} className="p-1 text-gray-600"><X className="w-4 h-4" /></button>
                                        </>
                                      ) : (
                                        <>
                                          <div className="font-semibold">₹{parseFloat(editableHolidayAmounts[d.holiday_date_id] || 0).toLocaleString()}</div>
                                          {d.holiday_paid === '1' && permissions.salary_edit && included && <button onClick={() => startEditHolidayDate(d.holiday_date_id)} className="p-1 text-[var(--color-text-secondary)]"><Edit className="w-4 h-4" /></button>}
                                          {d.holiday_paid === '2' && <div className="text-xs text-[var(--color-text-secondary)] px-2 py-1 rounded border">Unpaid</div>}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Loans & Advances - Only show if data exists */}
                {(payrollData.employee_loan_arr?.length > 0 || payrollData.employee_advance_arr?.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Loans - Only show if exists */}
                    {payrollData.employee_loan_arr?.length > 0 && (
                      <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[var(--color-text-primary)]">Loan Deductions</h3>
                          <div className="text-red-600 font-medium">- ₹{totalLoans.toLocaleString()}</div>
                        </div>
                        <div className="space-y-2">
                          {payrollData.employee_loan_arr.map(loan => (
                            <div key={loan.loan_items_id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!selectedLoans[loan.loan_items_id]}
                                  onChange={() => toggleLoan(loan.loan_items_id)}
                                  className="w-4 h-4"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Loan Installment</div>
                                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                    <div>Amount: ₹{parseFloat(loan.loan_amount || 0).toLocaleString()}</div>
                                    <div>Interest: {loan.interest_rate}% | Tenure: {loan.tenure} months</div>
                                    <div>Due: {new Date(loan.loan_payment_date).toLocaleDateString('en-GB')}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="font-semibold text-red-600">₹{parseFloat(loan.installment_amount || 0).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advances - Only show if exists */}
                    {payrollData.employee_advance_arr?.length > 0 && (
                      <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[var(--color-text-primary)]">Advance Deductions</h3>
                          <div className="text-red-600 font-medium">- ₹{totalAdvances.toLocaleString()}</div>
                        </div>
                        <div className="space-y-2">
                          {payrollData.employee_advance_arr.map(adv => (
                            <div key={adv.advance_id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!selectedAdvances[adv.advance_id]}
                                  onChange={() => toggleAdvance(adv.advance_id)}
                                  className="w-4 h-4"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Advance Payment</div>
                                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                    <div>Max Amount: ₹{parseFloat(adv.advance_amount || 0).toLocaleString()}</div>
                                    <div>Date: {new Date(adv.advance_disbursement_date).toLocaleDateString('en-GB')}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {editingAdvanceId === adv.advance_id ? (
                                  <>
                                    <input
                                      type="number"
                                      value={editableAdvances[adv.advance_id] || '0'}
                                      onChange={e => setEditableAdvances(prev => ({ ...prev, [adv.advance_id]: e.target.value }))}
                                      className="w-28 px-2 py-1 border rounded"
                                      min="0"
                                      max={adv.advance_amount}
                                      step="0.01"
                                    />
                                    <button onClick={() => saveAdvance(adv.advance_id)} className="p-1 text-green-600">
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingAdvanceId(null);
                                        setEditableAdvances(prev => ({ ...prev, [adv.advance_id]: adv.advance_amount }));
                                      }}
                                      className="p-1 text-gray-600"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-red-600">
                                      ₹{parseFloat(editableAdvances[adv.advance_id] || 0).toLocaleString()}
                                    </div>
                                    {permissions.salary_edit && selectedAdvances[adv.advance_id] && (
                                      <button
                                        onClick={() => {
                                          setEditingAdvanceId(adv.advance_id);
                                          setEditableAdvances(prev => ({ ...prev, [adv.advance_id]: adv.advance_amount }));
                                        }}
                                        className="p-1 text-[var(--color-text-secondary)]"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete breakdown */}
                {/* Complete breakdown */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><IndianRupee className="w-5 h-5 mr-2" /> Complete Salary Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Monthly Salary</span><span className="font-semibold text-purple-700">₹{parseFloat(monthlySalary || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Base Salary (This Period)</span><span className="font-semibold">₹{parseFloat(baseSalary || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Overtime Pay</span><span className="font-medium">+ ₹{overtimeAndWeekoff.overtimePay.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Week-off Pay</span><span className="font-medium">+ ₹{overtimeAndWeekoff.weekoffPay.toLocaleString()}</span></div>

                    <div className="flex justify-between py-3 bg-[var(--color-blue-lightest)] px-4 rounded border mt-2"><span className="font-semibold">Pay Salary</span><span className="font-bold">₹{paySalary.toLocaleString()}</span></div>

                    {/* Only show if allowances exist */}
                    {totalAllowances > 0 && (
                      <div className="flex justify-between mt-4"><span className="text-green-600 font-medium flex items-center"><Plus className="w-4 h-4 mr-1" /> Total Allowances</span><span className="font-semibold text-green-600">+ ₹{totalAllowances.toLocaleString()}</span></div>
                    )}

                    {/* Only show if deductions exist */}
                    {totalDeductions > 0 && (
                      <div className="flex justify-between"><span className="text-red-600 font-medium flex items-center"><Minus className="w-4 h-4 mr-1" /> Total Deductions</span><span className="font-semibold text-red-600">- ₹{totalDeductions.toLocaleString()}</span></div>
                    )}

                    {/* Only show if holidays exist */}
                    {totalHolidays > 0 && (
                      <div className="flex justify-between"><span className="text-green-700 font-medium">Holiday Paid Amount</span><span className="font-semibold text-green-700">+ ₹{totalHolidays.toLocaleString()}</span></div>
                    )}

                    {/* Only show if loans exist */}
                    {totalLoans > 0 && (
                      <div className="flex justify-between">
                        <span className="text-red-600 font-medium flex items-center">
                          <Minus className="w-4 h-4 mr-1" /> Loan Deductions
                        </span>
                        <span className="font-semibold text-red-600">- ₹{totalLoans.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Only show if advances exist */}
                    {totalAdvances > 0 && (
                      <div className="flex justify-between">
                        <span className="text-red-600 font-medium flex items-center">
                          <Minus className="w-4 h-4 mr-1" /> Advance Deductions
                        </span>
                        <span className="font-semibold text-red-600">- ₹{totalAdvances.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-green-100 px-4 rounded-lg mt-4 border-2 border-green-300">
                      <div className="text-lg font-bold text-green-800">
                        Final Payable Amount
                        {finalPayableManuallyEdited && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Manually Adjusted</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-green-900">₹{finalPayable.toLocaleString()}</div>
                        {permissions.salary_edit && (
                          isEditingFinalPayable ? (
                            <>
                              <input
                                type="number"
                                value={editableFinalPayable}
                                onChange={e => setEditableFinalPayable(e.target.value)}
                                className="w-32 px-3 py-2 border rounded"
                                min="0"
                                step="0.01"
                              />
                              <button onClick={handleSaveFinalPayable} className="p-2 bg-green-600 text-white rounded">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={handleCancelFinalPayableEdit} className="p-2 bg-gray-500 text-white rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setIsEditingFinalPayable(true)} className="p-1 text-[var(--color-text-secondary)]">
                              <Edit className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remark */}
                {hasAnyEdit && (
                  <div className="bg-[var(--color-bg-secondary)] rounded-lg border-2 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[var(--color-blue-lighter)] rounded"><Edit className="w-5 h-5 text-[var(--color-blue-dark)]" /></div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Remark required for changes</h3>
                        <textarea value={editRemark} onChange={e => setEditRemark(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded" placeholder="Enter remark..." />
                        {editRemark.trim() && <div className="text-xs text-green-600 mt-2">Remark added</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] rounded-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Ready to Submit Payroll?</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">Final payable: <strong>₹{finalPayable.toLocaleString()}</strong></p>
                    </div>
                    <div>
                      {permissions['add_salary_payment'] && (
                        <button onClick={handleSubmitPayroll} disabled={submitting || isEditingFinalPayable || editingAllowanceId !== null || editingDeductionId !== null || editingHolidayDateId !== null} className="px-6 py-3 bg-green-600 text-white rounded-lg">
                          <CheckCircle className="w-5 h-5 inline mr-2" /> {submitting ? 'Submitting...' : 'Submit Payroll'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Confirm dialog */}
      {confirmModal.isOpen && (
        <ConfirmDialog
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, type: '', data: null })}
          onConfirm={confirmSubmitPayroll}
          title="Confirm Payroll Submission"
          message={
            <div>
              <p className="mb-4">Are you sure you want to submit payroll for <strong>{confirmModal.data?.employeeName}</strong> for <strong>{confirmModal.data?.month} {confirmModal.data?.year}</strong>?</p>
              <div className="bg-[var(--color-blue-lightest)] p-4 rounded">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Base Salary:</span><span className="font-medium">₹{parseFloat(confirmModal.data?.baseSalary || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Pay Salary:</span><span className="font-medium">₹{parseFloat(confirmModal.data?.paySalary || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between text-[var(--color-success-dark)]"><span>Allowances:</span><span className="font-medium">+ ₹{totalAllowances.toLocaleString()}</span></div>
                  <div className="flex justify-between text-[var(--color-error-dark)]"><span>Deductions:</span><span className="font-medium">- ₹{totalDeductions.toLocaleString()}</span></div>
                  <div className="flex justify-between text-[var(--color-success-dark)]"><span>Holidays:</span><span className="font-medium">+ ₹{totalHolidays.toLocaleString()}</span></div>
                  <div className="flex justify-between text-[var(--color-error-dark)]">
                    <span>Loans:</span>
                    <span className="font-medium">- ₹{totalLoans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-error-dark)]">
                    <span>Advances:</span>
                    <span className="font-medium">- ₹{totalAdvances.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between mt-2 bg-green-50 p-2 rounded"><span className="font-bold text-green-800">Final Payable:</span><span className="font-bold text-green-900">₹{confirmModal.data?.totalPaySalary}</span></div>
                </div>
              </div>
            </div>
          }
          confirmText="Submit Payroll"
          cancelText="Cancel"
          type="warning"
        />
      )}
    </>
  );
};

export default MonthlyPayroll;
