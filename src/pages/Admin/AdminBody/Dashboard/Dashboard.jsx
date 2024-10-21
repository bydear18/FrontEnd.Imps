import { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaFileAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
const Dashboard = () => {
  const [values, setValues] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    fetch("https://backimps-production.up.railway.app/records/requestCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          pendingRequests: data.pendingRequests || 0,
          inProgressRequests: data.inProgressRequests || 0,
          completedRequests: data.completedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
        }));
       
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);


    const getSeverity = (status) => {
        switch (status) {
            default:
                return 'info';

            case 'New':
                return 'info';

            case 'Pending':
                return 'warning';

            case '':
                return null;
        }
    };


const onGlobalFilterChange = (e) => {
  const value = e.target.value;
  let _filters = { ...filters };

  _filters['global'].value = value;

  setFilters(_filters);
  setGlobalFilterValue(value);
};


const renderHeader = () => {
  return (
      <div id="historyHeader" className="flex">
          <h1>Pending Requests</h1>
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
          </IconField>
      </div>
  );
};
const header = renderHeader();


const statusBodyTemplate = (rowData) => {
  return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
};


return (
  <div style={{ backgroundColor: '#fff', height: '50vw' }}>
    <div className="dashboard-container">
      <div className="box-container">
        {/* Request status boxes */}
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{ color: '#4a90e2' }} className="icon" />
            <p className="box-text">Approved for Printing</p>
          </div>
          <div className="extra-box">
            <p className="count">
              {statistics.inProgressRequests}
            </p>
          </div>
        </div>

        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{ color: '#db7c2e;' }} className="icon" />
            <p className="box-text">Waiting for Approval</p>
          </div>
          <div className="extra-box">
            <p className="count">
              { statistics.pendingRequests}
            </p>
          </div>
        </div>
      
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{ color: '#08af5c' }} className="icon" />
            <p className="box-text">Completed Requests</p>
          </div>
          <div className="extra-box">
            <p className="count">{statistics.completedRequests}</p>
          </div>
        </div>
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{ color: '#681016' }} className="icon" />
            <p className="box-text">Rejected Requests</p>
          </div>
          <div className="extra-box">
            <p className="count">{statistics.rejectedRequests}</p>
          </div>
        </div>
      </div>
      <div id="pendingTable">
                <DataTable value={values} scrollable scrollHeight="30vw" header={header} globalFilterFields={['userID', 'requestID', 'fileName', 'requestDate']}
                    filters={filters} emptyMessage="No records found."
                    paginator rows={8}
                    tableStyle={{ minWidth: '20vw' }} selectionMode="single">
                    <Column field="userID" header="User ID"></Column>
                    <Column field="requestID" header="Request ID"sortable></Column>
                    <Column field="fileType" header="File Type"sortable></Column>
                    <Column field="fileName" header="File Name"></Column>
                    <Column field="requestDate" header="Request Date"></Column>
                    <Column field="useDate" header="Use Date"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate}sortable></Column>
                </DataTable>
            </div>
    </div>
  </div>
);

};

export default Dashboard;
