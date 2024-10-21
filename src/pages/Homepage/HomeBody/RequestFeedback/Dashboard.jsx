import './Dashboard.css';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [values, setValues] = useState([]);
  const [notifShow, setNotifShow] = useState('hide');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch("https://backimps-production.up.railway.app/notifications/id?id=" + localStorage.getItem("userID"), requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setValues(data);
      })
      .catch(error => {
        console.log(error);
      });

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetch("https://backimps-production.up.railway.app/services/checkAdmin?email=" + localStorage.getItem("email"), requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data !== true) {
            setNotifShow('show');
          } else {
            setNotifShow('hide');
            fetch("https://backimps-production.up.railway.app/notifications/id?id=" + localStorage.getItem("userID"), requestOptions)
              .then((response) => response.json())
              .then((data) => {
                setValues(data);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setNotifShow('hide');
    }
  }, []);

  const handleContentClick = (requestID) => {
    fetch(`https://backimps-production.up.railway.app/comments/id?id=${requestID}`)
      .then((response) => response.json())
      .then((data) => {
        // Filter comments sent by Admin
        const adminComments = data.filter(comment => comment.sentBy === 'Head');
        setSelectedContent(adminComments); // Store the filtered comments
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent([]); // Clear the content when closing the modal
  };

  return (
    <div className="dashboard">
      <div className="notif-popup always-visible">
        <div className="notif-body">
          {values.length === 0 ? (
            <div className="notif-empty">No new notifications</div>
          ) : (
            values.map((notif, idx) => (
              <div key={idx} className="notif-item">
                <h1 className="notif-id">#{notif.requestID}</h1>
                <p className="notif-header">{notif.header}</p>
                <p className="notif-content">{notif.content}</p>
                
                {notif.header === "Request Rejected!" && (
                  <button onClick={() => handleContentClick(notif.requestID)}>View Comment</button>
                )}
                
                <p className="notif-date">{notif.createdDate}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Comments from Admin</h2>
            {selectedContent.length === 0 ? (
              <p>No comments available from Admin.</p>
            ) : (
              selectedContent.map((comment, index) => (
                <div key={index}>
                  <h3>{comment.header}</h3>
                  <p>{comment.content}</p>
                  <p style={{marginTop: '5vw'}}><em>Sent by: {comment.sentBy} on {comment.sentDate}</em></p>
                  <hr />
                </div>
              ))
            )}
            <div className="modal-actions">
              <button style={{marginTop: '2.5vw'}} className="close-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
