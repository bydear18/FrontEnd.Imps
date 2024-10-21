import './hometab.css';

import React, { useEffect, useState } from 'react';

const Hometab = () => {
    const [tab1, setTab1] = useState('');
    const [tab2, setTab2] = useState('');
    const [tab3, setTab3] = useState('');
    const [tab4, setTab4] = useState('');
    const [tab5, setTab5] = useState('');
    const [toggleState, setToggleState] = useState(1);
    const [headerName, setHeaderName] = useState('Listen Here!');
    const [adminEdit, setAdminEdit] = useState('hide');
    const [blocked, setBlocked] = useState(true);
    const [buttonText, setButtonText] = useState('Edit');
    const [editing, setEditing] = useState(false);

    const changeHeader = (header) => {
        setHeaderName(header);
    };

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleEdit = () => {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        if (!editing) {
            // Start editing mode
            setEditing(true);
            setBlocked(false);
            setButtonText('Done');
        } else {
            // End editing mode and send the data
            const params = new URLSearchParams({
                ann: tab1.replace(/\n/g, '\n'),  // Preserve newlines
                guide: tab2.replace(/\n/g, '\n'),
                loc: tab4.replace(/\n/g, '\n'),
                pro: tab3.replace(/\n/g, '\n'),
                upd: tab5.replace(/\n/g, '\n'),
            });
    
            fetch(`https://backimps-production.up.railway.app/services/createHome?${params.toString()}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setEditing(false);
                    setBlocked(true);
                    setButtonText('Edit');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };
    
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        // Check if the user is an admin
        fetch(`https://backimps-production.up.railway.app/services/checkAdmin?email=${localStorage.getItem("email")}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAdminEdit(data ? 'show' : 'hide');
            })
            .catch((error) => {
                console.error(error);
            });
    
        // Fetch home data if not editing
        if (!editing) {
            fetch("https://backimps-production.up.railway.app/services/getHomeNumber", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data >= 1) {
                        fetch("https://backimps-production.up.railway.app/services/getHome", requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                setTab1(data['announcements'].replace(/\\n/g, '\n')); // Ensure newlines are preserved
                                setTab2(data['guidelines'].replace(/\\n/g, '\n'));
                                setTab3(data['process'].replace(/\\n/g, '\n'));
                                setTab4(data['locations'].replace(/\\n/g, '\n'));
                                setTab5(data['updates'].replace(/\\n/g, '\n'));
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [editing]);
    

    return (
        <div id='homeBox'>
            <div id='tabCont'>
                <div className={toggleState === 1 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(1); changeHeader('Listen Here!') }}>Announcements</div>
                <div className={toggleState === 2 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(2); changeHeader('Guidelines') }}>Guidelines</div>
                <div className={toggleState === 3 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(3); changeHeader('Claiming Process') }}>Claiming Process</div>
                <div className={toggleState === 4 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(4); changeHeader('Where to Claim?') }}>Locations</div>
                <div className={toggleState === 5 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(5); changeHeader("What's New?") }}>Updates</div>
            </div>

            <div className="Hcontentpos">
                <div id="adminHomeHeader">
                    <h1>{headerName}</h1>
                    <button id="adminEdit" className={adminEdit} onClick={handleEdit}>{buttonText}</button>
                </div>
                <hr />
                <div className={toggleState === 1 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab1}
                        disabled={blocked}
                        onChange={(e) => { setTab1(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 2 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab2}
                        disabled={blocked}
                        onChange={(e) => { setTab2(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 3 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab3}
                        disabled={blocked}
                        onChange={(e) => { setTab3(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 4 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab4}
                        disabled={blocked}
                        onChange={(e) => { setTab4(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 5 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab5}
                        disabled={blocked}
                        onChange={(e) => { setTab5(e.target.value); }}
                        className='homeText'
                    />
                </div>
            </div>
        </div>
    );
};

export default Hometab;
