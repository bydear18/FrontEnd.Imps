import './adminbody.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import Hometab from '../../Homepage/HomeBody/HomeTab/HomeTab';
import Wildcat from '../../Homepage/HomeBody/Wildcat.png';
import UserManagement from './AdminAccount/UserManagement';
import Dashboard from './Dashboard/Dashboard';
import Reports from './Reports/Reports';
import History from './RequestHistory/History';

function AdminBody () {
    const navigate = useNavigate()

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
          },
          };

        fetch("https://backimps-production.up.railway.app/services/checkAdmin?email=" + localStorage.getItem("email"), requestOptions).then((response)=> response.json()
        ).then((data) => {
            if(data!==true){
                if(localStorage.getItem("isLoggedIn")!=="true"){
                    navigate("/");
                }else{
                    navigate("/admin");
                }
            }
        })
        .catch(error =>
            {
                console.log(error);
            }
        );
    });

    const [toggleState, setToggleState] = useState(1);

        const toggleTab = (index) => {
            setToggleState(index);
        }

    return (

    <div id="whole">
        <div id="container">
            <div className={toggleState === 1 ? "tab active-tab" : "tab"} onClick={() => toggleTab(1)}>Home</div>
            <div className={toggleState === 2 ? "tab active-tab" : "tab"} onClick={() => toggleTab(2)}>Dashboard</div>
            <div className={toggleState === 3 ? "tab active-tab" : "tab"} onClick={() => toggleTab(3)}>Request History</div>
            <div className={toggleState === 4 ? "tab active-tab" : "tab"} onClick={() => toggleTab(4)}>System Report</div>
            <div className={toggleState === 5 ? "tab active-tab" : "tab"} onClick={() => toggleTab(5)}>Account</div>
        </div>

        <div className={toggleState === 1 ? "content active-content" : "content"} onClick={() => toggleTab(1)}>
            <Hometab/>
        </div>

        <div className={toggleState === 2 ? "content active-content" : "content"} onClick={() => toggleTab(2)}>
            <Dashboard/>
        </div>
    
        <div className={toggleState === 3 ? "content active-content" : "content"} onClick={() => toggleTab(3)}>
            <History/>
        </div>

        <div className={toggleState === 4 ? "content active-content" : "content"} onClick={() => toggleTab(4)}>
            <Reports />
        </div>

        <div className={toggleState === 5 ? "content active-content" : "content"} onClick={() => toggleTab(5)}>
            <UserManagement/>
        </div>

        <img src={Wildcat} alt="Wildcat logo"/>
    </div>



        )
    };

export default AdminBody;