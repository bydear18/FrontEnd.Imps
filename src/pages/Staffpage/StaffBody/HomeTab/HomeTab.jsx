import './hometab.css';

import React, { useEffect, useState } from 'react';

const Hometab = () => {
    const [tab1, setTab1] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab2, setTab2] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab3, setTab3] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab4, setTab4] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab5, setTab5] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
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
            setEditing(true);
            setBlocked(false);
            setButtonText('Done');
        } else {
            fetch(`https://backimps-production.up.railway.app/services/createHome?ann=${tab1}&guide=${tab2}&loc=${tab4}&pro=${tab3}&upd=${tab5}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setEditing(false);
                    setBlocked(true);
                    setButtonText('Edit');
                })
                .catch((error) => {
                    console.log(error);
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

        fetch(`https://backimps-production.up.railway.app/services/checkAdmin?email=${localStorage.getItem("email")}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAdminEdit(data ? 'show' : 'hide');
            })
            .catch((error) => {
                console.log(error);
            });

        if (!editing) {
            fetch("https://backimps-production.up.railway.app/services/getHomeNumber", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data >= 1) {
                        fetch("https://backimps-production.up.railway.app/services/getHome", requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                setTab1(data['announcements'].replace(/\\n/g, '\n'));
                                setTab2(data['guidelines'].replace(/\\n/g, '\n'));
                                setTab3(data['process'].replace(/\\n/g, '\n'));
                                setTab4(data['locations'].replace(/\\n/g, '\n'));
                                setTab5(data['updates'].replace(/\\n/g, '\n'));
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
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
