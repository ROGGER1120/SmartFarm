import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../api';

export default function ReportsView({ farmId }) {
  const [reportType, setReportType] = useState('expenses'); // 'expenses' | 'crops'
  const [expenseData, setExpenseData] = useState(null);
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (farmId) loadReport();
  }, [farmId, reportType]);

  const loadReport = async () => {
    try {
      setLoading(true);
      if (reportType === 'expenses') {
        const data = await api.getExpenseReport(farmId, startDate, endDate);
        setExpenseData(data);
      } else {
        const data = await api.getCropReport(farmId);
        setCropData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    loadReport();
  };

  // CSV Export
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === 'expenses') {
      csvContent += "Date,Category,Item/Activity,Crop,Field,Amount (INR),Remarks\n";
      expenseData?.records?.forEach(r => {
        csvContent += `"${new Date(r.date).toLocaleDateString()}","${r.category}","${r.item}","${r.crop}","${r.field}","${r.amount}","${r.remarks}"\n`;
      });
    } else {
      csvContent += "Crop Name,Variety,Season,Field,Acreage,Stage,Estimated Yield,Actual Yield,Revenue (INR),Status\n";
      cropData?.forEach(c => {
        csvContent += `"${c.name}","${c.variety}","${c.season}","${c.fieldName}","${c.areaCultivated}","${c.stage}","${c.estimatedYield} ${c.yieldUnit}","${c.actualYield} ${c.yieldUnit}","${c.actualRevenue}","${c.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartFarm_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export using jsPDF and autoTable
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(6, 35, 25); // #062319 forest green
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SmartFarm • Krishivedika ERP", 14, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Farm Resource Management & Optimization Audit Report", 14, 23);

    // Meta details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 38);
    doc.text(`Report Type: ${reportType === 'expenses' ? 'Farm Cultivation Expense Audit' : 'Crop Production & Yield Report'}`, 14, 44);

    if (reportType === 'expenses') {
      doc.text(`Total Cultivation Expenditure: INR ${expenseData?.totalExpense?.toLocaleString()}`, 14, 50);

      const tableRows = expenseData?.records?.map(r => [
        new Date(r.date).toLocaleDateString(),
        r.category,
        r.item,
        r.crop,
        `INR ${Number(r.amount).toLocaleString()}`,
        r.remarks
      ]) || [];

      autoTable(doc, {
        startY: 56,
        head: [['Date', 'Category', 'Description', 'Crop', 'Amount', 'Status']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 8 }
      });
    } else {
      const tableRows = cropData?.map(c => [
        c.name,
        c.variety,
        c.fieldName,
        `${c.areaCultivated} Ac`,
        c.stage,
        `${c.estimatedYield} ${c.yieldUnit}`,
        c.actualYield ? `${c.actualYield} ${c.yieldUnit}` : '-',
        `INR ${Number(c.actualRevenue || 0).toLocaleString()}`,
        c.status
      ]);

      autoTable(doc, {
        startY: 52,
        head: [['Crop', 'Variety', 'Field', 'Area', 'Stage', 'Est Yield', 'Actual', 'Revenue', 'Status']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 8 }
      });
    }

    doc.save(`SmartFarm_${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Farm Reports & Compliance Exports
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Consolidated resource expenditure logs, production harvests and one-click PDF / CSV exports
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExportPDF} className="btn btn-primary">
            <Download size={16} />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Report Switcher & Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setReportType('expenses')}
            className={`btn ${reportType === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 14px', fontSize: '0.84rem' }}
          >
            Farm Expense Report
          </button>
          <button
            onClick={() => setReportType('crops')}
            className={`btn ${reportType === 'crops' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 14px', fontSize: '0.84rem' }}
          >
            Crop Production & Yield Report
          </button>
        </div>

        {reportType === 'expenses' && (
          <form onSubmit={handleApplyFilter} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From:</span>
            <input
              type="date"
              className="input-control"
              style={{ padding: '6px 10px', fontSize: '0.8rem', width: '140px' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>To:</span>
            <input
              type="date"
              className="input-control"
              style={{ padding: '6px 10px', fontSize: '0.8rem', width: '140px' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Compiling report data...</p>
        </div>
      ) : reportType === 'expenses' ? (
        <div>
          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Records</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                {expenseData?.totalCount} Entries
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Water Expense</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                ₹{expenseData?.categoryBreakdown?.Water?.toLocaleString()}
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fertilizer Expense</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                ₹{expenseData?.categoryBreakdown?.Fertilizer?.toLocaleString()}
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Labour Expense</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                ₹{expenseData?.categoryBreakdown?.Labour?.toLocaleString()}
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Machinery Expense</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
                ₹{expenseData?.categoryBreakdown?.Machinery?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Expense Records Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Activity / Item Details</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Crop & Field</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Remarks</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData?.records?.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span className={`badge ${
                          r.category === 'Water' ? 'badge-info' : r.category === 'Fertilizer' ? 'badge-success' : r.category === 'Labour' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {r.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', fontWeight: 600 }}>
                        {r.item}
                      </td>
                      <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                        {r.crop} ({r.field})
                      </td>
                      <td style={{ padding: '12px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {r.remarks}
                      </td>
                      <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{Number(r.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Crop Production Report */
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Crop</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Variety</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Season</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Field & Acreage</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Sowing / Harvest</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Stage</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Est. Yield</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Actual Yield</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: '14px 18px' }}>{c.variety}</td>
                    <td style={{ padding: '14px 18px' }}>{c.season}</td>
                    <td style={{ padding: '14px 18px' }}>{c.fieldName} ({c.areaCultivated} Ac)</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {new Date(c.sowingDate).toLocaleDateString()} to {new Date(c.expectedHarvestDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-success">{c.stage}</span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600 }}>{c.estimatedYield} {c.yieldUnit}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: c.actualYield > 0 ? '#059669' : 'var(--text-muted)' }}>
                      {c.actualYield ? `${c.actualYield} ${c.yieldUnit}` : 'Pending'}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#059669' }}>
                      ₹{c.actualRevenue ? Number(c.actualRevenue).toLocaleString() : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
