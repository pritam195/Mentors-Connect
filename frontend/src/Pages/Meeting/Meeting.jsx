import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Meeting.css"; 
import Navbar from "../../Component/Navbar/Navbar";

const Meeting = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await axios.get("https://mentors-connect-1-m3po.onrender.com/api/sessions");
                setMeetings(res.data);
            } catch (err) {
                console.error("Error fetching meetings:", err);
                setError("Failed to fetch meetings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const closeModal = (e) => {
        if (e.target.classList.contains("modal")) {
            setSelectedMeeting(null);
        }
    };

    return (
        <>
        <Navbar />
        <div className="meeting-container">
                <h2 className="meeting-title">Upcoming Meetings</h2> 
                <button className="hostmeeting-btn"><a href="/host-meeting">Create Meeting</a></button>

            {loading ? (
                <p>Loading meetings...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : meetings.length === 0 ? (
                <p>No meetings available</p>
            ) : (
                <ul className="meeting-list">
                    {meetings.map((meeting) => (
                        <li key={meeting._id} className="meeting-card">
                            <div>
                                <h3>{meeting.sessionName}</h3>
                                <p>Date: {formatDate(meeting.date)}</p>
                                <p>Time: {meeting.time}</p>
                            </div>
                            <button
                                className="details-btn"
                                onClick={() => setSelectedMeeting(meeting)}
                            >
                                See Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}

                {selectedMeeting && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content">
                            <h2>{selectedMeeting.sessionName}</h2>
                            <p>{selectedMeeting.description}</p>
                            <p>
                                <strong>Date:</strong> {formatDate(selectedMeeting.date)}
                            </p>
                            <p>
                                <strong>Time:</strong> {selectedMeeting.time}
                            </p>

                            {/* ✅ FIXED: Use flat structure instead of nested */}
                            {selectedMeeting.meetingId && (
                                <>
                                    <p>
                                        <strong>🔗 Join Link:</strong>{" "}
                                        <a
                                            href={selectedMeeting.joinLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {selectedMeeting.joinLink}
                                        </a>
                                    </p>
                                    <p>
                                        <strong>🆔 Meeting ID:</strong> {selectedMeeting.meetingId}
                                    </p>
                                    <p>
                                        <strong>🔒 Password:</strong> {selectedMeeting.password}
                                    </p>
                                </>
                            )}

                            <button
                                className="close-btn"
                                onClick={() => setSelectedMeeting(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}


            </div>

            
            </>
    );
};

export default Meeting;

