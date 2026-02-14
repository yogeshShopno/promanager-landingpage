import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
// ---------- CONSTANTS: FIT EXACTLY INSIDE A4 LANDSCAPE INNER WIDTH ----------
const GRID_COLS = 31;

// A4 landscape width in PDF points (≈ 841.89). Your page has 15pt padding on both sides.
const A4_LANDSCAPE_WIDTH = 841.89;
const PAGE_PADDING = 15;

// inner drawable width after padding
const INNER_W = A4_LANDSCAPE_WIDTH - (PAGE_PADDING * 2);

// give a tiny slack to avoid viewer rounding causing overflow
const SLACK = 0.5;

// total grid width we will use for every row/block
const GRID_W = INNER_W - SLACK;

// choose a label width; you can tweak this (e.g., 38~44) without overflow
const LABEL_W = 40;

// compute cell width so that label + 31*cell == GRID_W
const CELL_W = (GRID_W - LABEL_W) / GRID_COLS;

// Register fonts for better text rendering
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
    ]
});

// Compact styles optimized for maximum space utilization
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 15,
        fontSize: 8,
        fontFamily: 'Roboto'
    },
    headerContainer: {
        marginBottom: 6
    },
    reportTitle: {
        fontSize: 12,
        fontWeight: 700,
        textAlign: 'center',
        color: '#000',
        marginBottom: 2
    },
    reportDateRange: {
        fontSize: 9,
        fontWeight: 500,
        textAlign: 'center',
        color: '#000',
        marginBottom: 6
    },
    headerInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    companyInfo: {
        fontSize: 8,
        color: '#000'
    },
    printedOnInfo: {
        fontSize: 8,
        color: '#000'
    },
    hrLine: {
        height: 1,
        backgroundColor: '#000',
        marginBottom: 6
    },


    // Header
    header: {
        marginBottom: 10,
        borderBottom: '1 solid #000000',
        paddingBottom: 5
    },
    title: {
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 2
    },
    subtitle: {
        fontSize: 9,
        fontWeight: 500,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 1
    },
    dateRange: {
        fontSize: 7,
        color: '#333333',
        textAlign: 'center'
    },

    // Employee section
    employeeSection: {
        marginBottom: 8,
        border: '0.5 solid #000000'
    },
    employeeHeader: {
        backgroundColor: '#F5F5F5',
        padding: 3,
        borderBottom: '0.5 solid #000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    employeeName: {
        fontSize: 8,
        fontWeight: 600,
        color: '#000000'
    },
    employeeId: {
        fontSize: 6,
        color: '#333333'
    },

    // --- GRID BLOCK (exactly 31 columns) ---
    blockContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start' // so fixed width is respected
    },

    // each row has a fixed width to prevent stretching
    fixedRow: {
        width: GRID_W,
        alignSelf: 'flex-start',
        flexDirection: 'row'
    },

    blockHeaderRow: {
        backgroundColor: '#E0E0E0',
        borderBottom: '0.5 solid #000000'
    },
    blockDayRow: {
        borderBottom: '0.5 solid #CCCCCC'
    },

    // Label column
    labelCol: {
        width: LABEL_W,
        padding: 2,
        borderRight: '0.5 solid #000000',
        fontSize: 6,
        fontWeight: 600,
        backgroundColor: '#F7F7F7',
        flexGrow: 0,
        flexShrink: 0
    },

    // Day header cell
    dayCellHeader: {
        width: CELL_W,
        textAlign: 'center',
        padding: 1.5,
        borderRight: '0.5 solid #000000',
        fontSize: 6,
        fontWeight: 600,
        flexGrow: 0,
        flexShrink: 0
    },

    // Day data cell
    dayCell: {
        width: CELL_W,
        textAlign: 'center',
        padding: 1.5,
        borderRight: '0.25 solid #CCCCCC',
        fontSize: 6,
        flexGrow: 0,
        flexShrink: 0
    },

    // Data rows
    dataRow: {
        borderBottom: '0.25 solid #DDDDDD'
    },

    // spacer to visually separate blocks
    emptyrow: {
        width: GRID_W,
        height: 10,
        borderBottom: '0.5 solid #000000',
        alignSelf: 'flex-start'
    },

    // Status colors (black and white friendly)
    statusPresent: { color: '#000000', fontWeight: 500 },
    statusAbsent: { color: '#666666', fontWeight: 500 },
    statusLate: { color: '#333333', fontWeight: 500 },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        borderTop: '0.5 solid #000000',
        paddingTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerText: {
        fontSize: 5,
        color: '#666666'
    }
});

// -------------------- Utilities --------------------
const toKeyDate = (d) => {
    const dt = typeof d === 'string' ? new Date(d) : d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const parseDate = (d) => (typeof d === 'string' ? new Date(d) : d);

const addDays = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
};

const eachDayOfInterval = (start, end) => {
    const s = parseDate(start);
    const e = parseDate(end);
    const days = [];
    for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
        days.push(new Date(d));
    }
    return days;
};

const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
};
const pad2 = (n) => (n < 10 ? `0${n}` : String(n));
const formatPrintedOnHeader = (dt) => {
    const d = typeof dt === 'string' ? new Date(dt) : dt;
    const y = d.getFullYear();
    const m = d.toLocaleString('en-US', { month: 'short' });
    const day = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    return `${m} ${day} ${y} ${hh}:${mm}`;
};

const formatTime = (timeString) => {
    if (!timeString || timeString === '' || timeString === '00:00:00') return '-';
    if (timeString.includes('AM') || timeString.includes('PM')) return timeString;

    const [hoursStr, minutes] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
};

const getDayNameShort = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short' });

const formatHours = (hoursString) => {
    if (!hoursString || hoursString === '0' || hoursString === '') return '-';
    const hours = parseFloat(hoursString);
    if (hours === 0) return '-';
    return `${hours}h`;
};

const getStatusColorStyle = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'present': return styles.statusPresent;
        case 'absent': return styles.statusAbsent;
        case 'partial': return styles.statusLate;
        default: return styles.statusPresent;
    }
};

const isLateFromHours = (lateHours) => {
    if (!lateHours || lateHours === '0' || lateHours === '') return 'No';
    const hours = parseFloat(lateHours);
    return hours > 0 ? 'Yes' : 'No';
};

// Group data by employee (indexed by date for O(1) lookups)
const groupDataByEmployee = (data) => {
    const grouped = {};
    data.forEach(record => {
        const key = `${record.employee_name}_${record.employee_code}`;
        if (!grouped[key]) {
            grouped[key] = {
                employeeName: record.employee_name,
                employeeCode: record.employee_code,
                byDate: {}
            };
        }
        const k = toKeyDate(record.date);
        grouped[key].byDate[k] = record;
    });
    return grouped;
};

// Build full date range and chunk into 31-day blocks (we'll still render 31 columns per block)
const buildDateBlocks = (startDate, endDate) => {
    const allDays = eachDayOfInterval(startDate, endDate);
    return chunk(allDays, GRID_COLS);
};

// pads an array of dates to exactly GRID_COLS by appending nulls
const padToGrid = (dates) => {
    const arr = dates.slice(0, GRID_COLS);
    while (arr.length < GRID_COLS) arr.push(null);
    return arr;
};

// -------------------- Employee Grid Block --------------------
const EmployeeGridBlock = ({ employee, dates }) => {
    // Force exactly 31 cells per row
    const paddedDates = padToGrid(dates);
    const dateKeys = paddedDates.map(d => (d ? toKeyDate(d) : null));

    return (
        <View style={styles.blockContainer} wrap={false}>
            {/* Block Header: Date numbers */}
            <View style={[styles.fixedRow, styles.blockHeaderRow]}>
                <Text style={styles.labelCol}>Date</Text>
                {paddedDates.map((d, i) => (
                    <Text key={`dnum-${i}`} style={styles.dayCellHeader}>
                        {d ? String(d.getDate()).padStart(2, '0') : ''}
                    </Text>
                ))}
            </View>

            {/* Block Day Row: Weekday */}
            <View style={[styles.fixedRow, styles.blockDayRow]}>
                <Text style={styles.labelCol}>Day</Text>
                {paddedDates.map((d, i) => (
                    <Text key={`dwd-${i}`} style={styles.dayCell}>
                        {d ? getDayNameShort(d) : ''}
                    </Text>
                ))}
            </View>

            {/* In row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>In</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    return (
                        <Text key={`in-${i}`} style={styles.dayCell}>
                            {rec ? formatTime(rec.attandance_first_clock_in) : '-'}
                        </Text>
                    );
                })}
            </View>

            {/* Out row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>Out</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    return (
                        <Text key={`out-${i}`} style={styles.dayCell}>
                            {rec ? formatTime(rec.attandance_last_clock_out) : '-'}
                        </Text>
                    );
                })}
            </View>

            {/* Hours row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>Working Hours</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    return (
                        <Text key={`hrs-${i}`} style={styles.dayCell}>
                            {rec ? formatHours(rec.attandance_hours) : '-'}
                        </Text>
                    );
                })}
            </View>

            {/* Late row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>Remain Hrs.</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    return (
                        <Text key={`late-${i}`} style={styles.dayCell}>
                            {rec ? isLateFromHours(rec.late_hours) : '-'}
                        </Text>
                    );
                })}
            </View>

            {/* OT row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>OT</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    return (
                        <Text key={`ot-${i}`} style={styles.dayCell}>
                            {rec ? formatHours(rec.overtime_hours) : '-'}
                        </Text>
                    );
                })}
            </View>

            {/* Status row */}
            <View style={[styles.fixedRow, styles.dataRow]}>
                <Text style={styles.labelCol}>Status</Text>
                {dateKeys.map((k, i) => {
                    const rec = k ? employee.byDate[k] : null;
                    const txt = rec?.status || '-';
                    const colorStyle = getStatusColorStyle(rec?.status);
                    return (
                        <Text key={`st-${i}`} style={[styles.dayCell, colorStyle]}>
                            {txt}
                        </Text>
                    );
                })}
            </View>

            {/* separator */}
            <View style={styles.emptyrow} />
        </View>
    );
};

// -------------------- PDF Document --------------------
const AttendanceReportDocument = ({ data, startDate, endDate }) => {
    const grouped = groupDataByEmployee(data);
    const employeeKeys = Object.keys(grouped).sort();
    const dateBlocks = buildDateBlocks(startDate, endDate); // arrays of <=31 days

    // 2 employees per page (tweak if you want)
    const EMP_PER_PAGE = 2;

    const pages = [];
    for (let i = 0; i < employeeKeys.length; i += EMP_PER_PAGE) {
        pages.push(employeeKeys.slice(i, i + EMP_PER_PAGE));
    }

    return (
        <Document>
            {pages.map((empSlice, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
                    {/* Header - only on first page */}
                    {pageIndex === 0 && (
                        <View style={styles.headerContainer}>
                            <Text style={styles.reportTitle}>Custom Date Range Report(Work Duration)</Text>
                            <Text style={styles.reportDateRange}>
                                {new Date(startDate).toLocaleString('en-US', { month: 'short' })} {pad2(new Date(startDate).getDate())} {new Date(startDate).getFullYear()}{" "}
                                To{" "}
                                {new Date(endDate).toLocaleString('en-US', { month: 'short' })} {pad2(new Date(endDate).getDate())} {new Date(endDate).getFullYear()}
                            </Text>

                            <View style={styles.headerInfoRow}>
                                <Text style={styles.companyInfo}>
                                    Company: {'Your Company Name'}
                                </Text>
                                <Text style={styles.printedOnInfo}>
                                    Printed On : {formatPrintedOnHeader(new Date())}
                                </Text>
                            </View>

                            <View style={styles.hrLine} />
                        </View>
                    )}



                    {/* Employees on this page */}
                    {empSlice.map((ekey) => {
                        const employee = grouped[ekey];
                        return (
                            <View key={ekey} style={styles.employeeSection} wrap={false}>
                                <View style={styles.employeeHeader}>
                                    <Text style={styles.employeeName}>{employee.employeeName}</Text>
                                    <Text style={styles.employeeId}>Code: {employee.employeeCode}</Text>
                                </View>

                                {/* Render blocks; each is fixed-width with 31 columns */}
                                {dateBlocks.map((dates, bi) => (
                                    <EmployeeGridBlock key={`blk-${ekey}-${bi}`} employee={employee} dates={dates} />
                                ))}
                            </View>
                        );
                    })}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Generated: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}
                        </Text>
                        <Text style={styles.footerText}>
                            Page {pageIndex + 1} of {pages.length}
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

// -------------------- Export --------------------
export const exportToPDF = async (data, startDate, endDate) => {
    try {
        if (!data || data.length === 0) {
            throw new Error('No attendance data available for export');
        }

        const doc = <AttendanceReportDocument data={data} startDate={startDate} endDate={endDate} />;
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();

        const fileName = `Attendance_Report_${formatDate(startDate)}_to_${formatDate(endDate)}.pdf`;
        saveAs(blob, fileName);

        return {
            success: true,
            message: `PDF exported successfully! Report contains ${data.length} records.`,
            recordCount: data.length,
            employeeCount: [...new Set(data.map(record => record.employee_code))].length
        };
    } catch (error) {
        console.error('PDF Export Error:', error);
        throw new Error(`Failed to export PDF: ${error.message}`);
    }
};
