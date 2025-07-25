import React, { useEffect, useState } from 'react';
import './MeetingCom.css';
import Navbar from '../Navbar/Navbar';

const MeetingCom = () => {
    const [meeting, setMeeting] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [formData, setFormData] = useState({
        sessionName: '',
        description: '',
        date: '',
        time : ''
    });

    const token = new URLSearchParams(window.location.search).get("token");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://mentors-connect-zh64.onrender.com/api/sessionInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = "https://mentors-connect-zh64.onrender.com/zoom/auth";
            } else {
                const data = await response.json();
                setError(data.message || "Failed to save session details");
            }
        } catch (err) {
            console.log("Error submitting form:", err);
            setError("Server error occurred");
        }
    };

    useEffect(() => {
        fetch("https://mentors-connect-zh64.onrender.com/api/create-meeting", {
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) throw new Error("Meeting creation failed");
                return res.json();
            })
            .then((data) => {
                console.log("🎉 Meeting created: ", data);
                setMeeting(data);
            })
            .catch((err) => {
                console.error("Error creating meeting:", err);
                setError("Could not create meeting.");
            });
    }, []);
      
    

    const extractMeetingId = (joinUrl) => {
        const match = joinUrl.match(/\/j\/(\d+)/);
        return match ? match[1] : 'Unavailable';
    };

    return (
        <>
            <Navbar />
            <div className="host-container">
                {!token && !meeting && (
                    <>
                        <h2>Schedule a Session</h2>
                        {error && <h3>{error}</h3>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name of the Session</label>
                                <input
                                    type="text"
                                    name="sessionName"
                                    value={formData.sessionName}
                                    onChange={handleChange}
                                    placeholder="Enter session name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter the description"
                                    rows={7.5}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date & Time of the Meeting</label>
                                <div className="date-time-group">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        />
                                
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        />
                                    </div>
                            </div>
                            <button type="submit" className="host-button">Create the meeting</button>
                        </form>
                    </>
                )}

                {token && !meeting && (
                    <div>Creating your meeting...</div>
                )}

                {meeting && (
                    <>
                        <h2>Zoom Meeting Created!</h2>
                        <div className="host-box">
                            <p><strong>🔗 Join Link:</strong> <a href={meeting.join_url} target="_blank" rel="noreferrer">{meeting.join_url}</a></p>
                            <p><strong>🆔 Meeting ID:</strong> {extractMeetingId(meeting.join_url)}</p>
                            <p><strong>🔒 Password:</strong> {meeting.password}</p>
                            <p><strong>🧑 Your Name:</strong></p>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="host-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <a
                                href={name ? meeting.join_url : "#"}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => {
                                    if (!name) {
                                        e.preventDefault();
                                        alert("Please enter your name first.");
                                    }
                                }}
                            >
                                <button className="host-button">Join Meeting</button>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MeetingCom;
