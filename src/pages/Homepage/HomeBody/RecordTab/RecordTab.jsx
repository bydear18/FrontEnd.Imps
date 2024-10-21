import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import './recordtab.css';

const Pending = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [show, setShow] = useState('hide');
    const [buttonShow, setButtonShow] = useState('hide');
    const [commentShow, setCommentShow] = useState('hide');
    const [rejectDisable, setRejectDisable] = useState(false);
    const [statusClass, setStatusClass] = useState('reqStatRejected');
    const [values, setValues] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });


    const [commentOptions, setCommentOptions] = useState([
        { label: 'Insufficient Information', value: 'Insufficient Information' },
        { label: 'Invalid Request', value: 'Invalid Request' },
        { label: 'Other', value: 'Other' },
    ]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [otherComment, setOtherComment] = useState('');
    
    const [requestID, setRequestID] = useState();
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [desc, setDesc] = useState('');
    const [fileName, setFileName] = useState('');
    const [giveExam, setGiveExam] = useState(false);
    const [noOfCopies, setNoOfCopies] = useState(0);
    const [colored, setColored] = useState(false);
    const [useDate, setUseDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [colorType, setColorType] = useState('');
    const [paperType, setPaperType] = useState('');
    const [fileType, setFileType] = useState('');
    const [status, setStatus] = useState('');
    const [userID, setUserID] = useState('');
    const [schoolId, setSchoolId]= useState('');
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState([]);
    const [requesterName, setRequesterName] = useState('');
    const [requesterEmail, setRequesterEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [downloadURL, setDownloadURL] = useState('');
    const [success, setSuccess] = useState(false);
    // Comment Details
    const [commentHeader, setCommentHeader] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentDate, setCommentDate] = useState('');
    
    const [editable, setEditable] = useState(true);

    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0, 10);
    };
    const [infoPopUpVisible, setInfoPopUpVisible] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    
    const handleCommentChange = (event) => {
        const value = event.value;
        setSelectedComment(value);

        if (value === 'Other') {
            setCommentShow('show'); 
        } else {
            setCommentShow('hide'); 
            setOtherComment(''); 
        }
    };


    const showInfoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
      };


      const closeInfoPop = () => {
        setAlert('hide');
      };

    // Date Values
    const [currentDate, setCurrentDate] = useState(getDate());

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleAccept = () => {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            "https://backimps-production.up.railway.app/records/acceptedStatus?requestID=" + requestID + 
            "&status=In Progress&email=" + email + 
            "&userID=" + userID + 
            "&date=" + currentDate + 
            "&schoolId=" + schoolId + 
            "&role=" + role,
            requestOptions
        )
        .then((response) => response.json())
        .then((data) => {
            showInfoPop('Request Accepted.');
            setTimeout(() => {
                window.location.reload();
            }, 3000); 
        })
        .catch((error) => {
            console.log(error);
        });
    };
    

    const handleReject = () => {
        setCommentDate(currentDate);
        setCommentHeader("Reason for Rejection");
        setRejectDisable(false);
        setEditable(false);
        setCommentContent('');
        setButtonShow('show');
        setCommentShow('show');
    };

    const proceedReject = (selectedComment) => {
        setRejectDisable(true);
        const commentData = new FormData();
        commentData.append("sentBy", "Head");
        commentData.append("header", commentHeader);
        commentData.append("content", selectedComment);
        commentData.append("sentDate", commentDate);
        commentData.append("requestID", requestID);
        
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (selectedComment != null && selectedComment !== '') {
            const requestOptionsComment = {
                method: 'POST',
                mode: 'cors',
                body: commentData
            };
            fetch("https://backimps-production.up.railway.app/comments/newComment", requestOptionsComment)
            .then((response) => response.json())
            .then((data) => {
                fetch("https://backimps-production.up.railway.app/rejectedStatus?requestID=" + requestID + "&status=Rejected&email=" + email + "&userID=" + userID + "&date=" + currentDate + "&role=" + role, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        showInfoPop(`Request Rejected!`, true);
                        setTimeout(() => {
                            setInfoPopUpVisible(false); 
                            setEditable(true);
                            setButtonShow('hide');
                            setCommentShow('hide');
                            window.location.reload();
                        }, 3000);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    const renderHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1>Request History</h1>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </IconField>
            </div>
        );
    };

    const renderCommentHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1 id='commentHeader'>Comments</h1>
                <button id='addComment' className={commentDisabled} onClick={handleAddComment}>+</button>
            </div>
        );
    };

    const header = renderHeader();
    const commentTableHeader = renderCommentHeader();

    const onCommentSelect = (event) => {
        setCommentDate(event.data.sentDate);
        setCommentHeader(event.data.header);
        setCommentContent(event.data.content);
        setCommentShow('show');
    };

    const onRowSelect = (event) => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://backimps-production.up.railway.app/requests/id?id=" + event.data.requestID + "&fileName=" + event.data.fileName, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setFileName(data['fileName']);
                setFileType(data['fileType']);
                setDepartment(data['department']);
                setPaperType(data['paperType']);
                setColored(data['color']);
                setColorType(data['colored']);
                setGiveExam(data['giveExam']);
                setSchoolId(data['schoolId']);
                setDesc(data['description']);
                setRequestDate(data['requestDate']);
                setUseDate(data['useDate']);
                setRequestID(data['requestID']);
                setNoOfCopies(data['noOfCopies']);
                setPaperSize(data['paperSize']);
                setEmail(data['requesterEmail']);
                setRole(data['role']);
                
                console.log(data['schoolId']);
                setUserID(data['userID']);
                setRequesterEmail(data['requesterEmail']);
                setRequesterName(data['requesterName']);
                setContactNumber(data['requesterNumber']);
                setDownloadURL(data['downloadURL']);


                fetch("https://backimps-production.up.railway.app/records/requestid?id=" + event.data.requestID, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        setStatus(data['status']);

                        if (data['status'] === 'Rejected') {
                            setStatusClass('capsuleRejected');
                        } else if (data['status'] === 'Pending') {
                            setStatusClass('capsulePending');
                        } else if (data['status'] === 'In Progress') {
                            setStatusClass('capsuleProgress');
                        } else if (data['status'] === 'Completed') {
                            setStatusClass('capsuleCompleted');
                        }
                        fetch("https://backimps-production.up.railway.app/comments/id?id=" + event.data.requestID, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                setComments(data);
                                setContent(data[0].content);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        setShow('show');
    };

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

    const closeComment = () => {
        setCommentDate('');
        setCommentHeader('');
        setCommentContent('');
        setCommentShow('hide');
    };

    const closeModal = () => {
        setShow('hide');
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://backimps-production.up.railway.app/records/all", requestOptions)
            .then((response) => response.json())
            .then((data) => { setValues(data); console.log(data) })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>

            <div id="pendingTable">
                <DataTable value={values} scrollable scrollHeight="30vw" header={header} globalFilterFields={['userID', 'requestID', 'fileName', 'requestDate']}
                    filters={filters} emptyMessage="No records found."
                    paginator rows={8}
                    tableStyle={{ minWidth: '20vw' }} selectionMode="single" onRowSelect={onRowSelect}>
                    <Column field="requestID" header="Request ID"sortable></Column>
                    <Column field="fileType" header="File Type"sortable></Column>
                    <Column field="fileName" header="File Name"></Column>
                    <Column field="requestDate" header="Request Date"></Column>
                    <Column field="useDate" header="Use Date"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate}sortable></Column>
                </DataTable>
            </div>
            <div id="overlay" className={show} onClick={closeModal}></div>
            <div id="requestBox" className={show}>
                <div id="infoPopOverlay" className={alert}></div>
                <div id="infoPop" className={alert}>
                    <p>{alertMsg}</p>
                    <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
                </div>
                <div id='boxDeets'>

                    <div id='firstLine'>
                        <h1 id='requestID'>{requestID}</h1>
                        <div className={statusClass}>{status}</div>
                        <p id='typeOfFile'>• {fileType}</p>
                        <p className='dates'>Date Requested: <p id='dateRequest'>{requestDate}</p></p>
                        <p className='dates'>Date Needed: <p id='dateUse'>{useDate}</p></p>
                    </div>

                    <p id='requester'>Request from:<p id='schoolId'>{schoolId}</p></p>

                    <div id='fileDeets'>FILE DETAILS</div>

                    <div id='secondLine'>
                        <p>File Name:</p> <input id='nameOfFile' type='text' disabled='true' value={fileName} />
                    </div>

                    <textarea id='descriptionOfFile' disabled='true' value={desc}>{desc}</textarea>

                    <div id='thirdLine'>
                        <div id='hatagExam'>Give exam personally: </div>
                        <input id='examBox' type='checkbox' checked={giveExam} disabled ='true'/>
                    </div>
                    <br></br>
                    <div id='fileDeets' style={{marginBottom:'.5vw'}}>PRINT SPECS</div>

                    <div id='fourthLine'>
                        <p id='coloredBa'>Color Type:<p className='specText'>{colorType}</p>
                            <div id='numberCopies' style={{marginBottom:'.5vw'}}>No. of Copies: <p className='specText'>{noOfCopies}</p>
                            </div>
                        </p>
                    </div>
                    <div id='fourthLine'>
                        <p id='coloredBa' style={{marginTop: '-1vw'}}>Paper Size:<p className='specText'>{paperSize}</p>
                            <div id='numberCopies'>PaperType: <p className='specText'>{paperType}</p></div>
                        </p>
                    <br></br>
                    </div>
                    <div id='contactDeets' style={{marginBottom:'.5vw'}}>REQUESTER'S INFORMATION</div>
                    <div className='infoLine'>Name: <div className='contactItem'>{requesterName}</div></div>
                    <div className='infoLine'>Email: <div className='contactItem'>{requesterEmail}</div></div>
                    <div className='infoLine'>Department/Office/College: <div className='contactItem'>{department}</div></div>

                    <div id="overlay" className = {commentShow} onClick={closeComment}></div>
                    <div id="deetCommentBody" className ={commentShow}>
                        <div id='commBod'>
                            <p>{commentDate}</p>
                            <button id='inAdd' className={buttonShow} onClick={createComment}>Add Comment</button>
                        </div>
                    </div>

                </div>
                <DataTable value={comments} header={commentTableHeader}
                    scrollable scrollHeight="17.48vw"
                    emptyMessage="No comments found." id='tableOfComments'
                    paginator rows={5}
                    tableStyle={{ minWidth: '5vw' }} selectionMode="single" onRowSelect={onCommentSelect}>
                    <Column field="sentBy" header="Sent by"></Column>
                    <Column field="content" header="Content"></Column>
                    <Column field="sentDate" header="Date"></Column>
            </DataTable>
            </div>
        </div>
    );
};

export default Pending;