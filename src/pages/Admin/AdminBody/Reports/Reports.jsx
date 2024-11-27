import './reports.css';
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Reports = () => {
  const [statistics, setStatistics] = useState({
    total: 0,
    waitingApproval: 0,
    approved: 0,
    readyToClaim: 0,
    claimed: 0,
    rejected: 0,
  });

  const pdfRef = useRef();
  const [modules, setModules] = useState(0);
  const [moduleCopies, setModuleCopies] = useState(0);
  const [officeForms, setOfficeForms] = useState(0);
  const [officeCopies, setOfficeCopies] = useState(0);
  const [exams, setExams] = useState(0);
  const [examCopies, setExamCopies] = useState(0);
  const [manuals, setManuals] = useState(0);
  const [manualCopies, setManualCopies] = useState(0);
  const [dates, setDates] = useState('week');

  const [values, setValues] = useState([
    {
      fileType: 'Module',
      number: modules,
      copies: moduleCopies,
    },
    {
      fileType: 'Office Form',
      number: officeForms,
      copies: officeCopies,
    },
    {
      fileType: 'Exam',
      number: exams,
      copies: examCopies,
    },
    {
      fileType: 'Manual',
      number: manuals,
      copies: manualCopies,
    },
  ]);

  const handleDays = (event) => {
    setDates(event.target.value);
  };

  const downloadReport = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('System Report.pdf');
    });
  };

  const renderHeader = () => {
    return (
      <div id="historyHeader" className="flex">
        <h1>System Report & User Statistics</h1>
        <select id="days" onChange={(e) => handleDays(e)}>
          <option value="week">Last 7 Days</option>
          <option value="2week">Last 14 Days</option>
          <option value="3week">Last 21 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="2month">Last 60 Days</option>
        </select>
      </div>
    );
  };

  const header = renderHeader();

  useEffect(() => {
    fetch('http://localhost:8080/services/statistics')
      .then((response) => response.json())
      .then((data) => {
        setStatistics({
          total: data.total || 0,
          waitingApproval: data.waitingApproval || 0,
          approved: data.approved || 0,
          readyToClaim: data.readyToClaim || 0,
          claimed: data.claimed || 0,
          rejected: data.rejected || 0,
        });
      })
      .catch((error) => console.error('Error fetching user statistics:', error));
  }, []);

  const chartData = {
    labels: ['Total', 'Waiting Approval', 'Approved', 'Ready to Claim', 'Claimed', 'Rejected'],
    datasets: [
      {
        label: 'Requests',
        data: [
          statistics.total,
          statistics.waitingApproval,
          statistics.approved,
          statistics.readyToClaim,
          statistics.claimed,
          statistics.rejected,
        ],
        backgroundColor: ['#c13e90', '#22dd58', '#e48d8e', '#ffd700', '#1e90ff', '#ff4500'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const requestsData = [
    { type: 'Total Requests', count: statistics.total },
    { type: 'Waiting for Approval Requests', count: statistics.waitingApproval },
    { type: 'Approved Requests', count: statistics.approved },
    { type: 'Ready to Claim Requests', count: statistics.readyToClaim },
    { type: 'Claimed Requests', count: statistics.claimed },
    { type: 'Rejected Requests', count: statistics.rejected },
  ];

  return (
    <div id="reportPage">
      <div id="reportsTable" ref={pdfRef}>
        <DataTable
          value={values}
          scrollable
          scrollHeight="28vw"
          header={header}
          emptyMessage="No data found."
          className="custom-data-table"
          selectionMode="single"
        >
          <Column field="fileType" header="Printed Document Type"></Column>
          <Column field="number" header="Total Number of Requests"></Column>
          <Column field="copies" header="Total Number of Copies"></Column>
        </DataTable>

        <div className="reports-container">
          <div className="chart-section">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="table-section">
            <DataTable value={requestsData} className="p-datatable-striped">
              <Column field="type" header="Request Type"></Column>
              <Column field="count" header="Count"></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <button id="dlButton" onClick={downloadReport}>
        Download Report
      </button>
    </div>
  );
};

export default Reports;
