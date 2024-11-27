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
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    inProgressRequests: 0,
    claimedRequests: 0,
    rejectedRequests: 0,
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

  // Fetch request statistics
  useEffect(() => {
    fetch("http://localhost:8080/records/requestCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          totalRequests: data.totalRequests || 0,
          pendingRequests: data.pendingRequests || 0,
          approvedRequests: data.approvedRequests || 0,
          inProgressRequests: data.inProgressRequests || 0,
          claimedRequests: data.claimedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
        }));
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);

  // Data for the chart
  const chartData = {
    labels: [
      'Total Requests',
      'Waiting for Approval Requests',
      'Approved Requests',
      'Ready to Claim Requests',
      'Claimed Requests',
      'Rejected Requests',
    ],
    datasets: [
      {
        label: 'Requests',
        data: [
          statistics.totalRequests,
          statistics.pendingRequests,
          statistics.approvedRequests,
          statistics.inProgressRequests,
          statistics.claimedRequests,
          statistics.rejectedRequests,
        ],
        backgroundColor: ['#c13e90', '#ffdd59', '#22dd58', '#44b6f8', '#a13ef0', '#e48d8e'],
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

  // Data for the user statistics table
  const usersData = [
    { type: 'Total Requests', count: statistics.totalRequests },
    { type: 'Waiting for Approval Requests', count: statistics.pendingRequests },
    { type: 'Approved Requests', count: statistics.approvedRequests },
    { type: 'Ready to Claim Requests', count: statistics.inProgressRequests },
    { type: 'Claimed Requests', count: statistics.claimedRequests },
    { type: 'Rejected Requests', count: statistics.rejectedRequests },
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
            <DataTable value={usersData} className="p-datatable-striped">
              <Column field="type" header="Request Statistics"></Column>
              <Column field="count" header="Count"></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <button id="dlButton" onClick={downloadReport}>Download Report</button>
    </div>
  );
};

export default Reports;
