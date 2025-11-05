import React, { useEffect, useState } from 'react';
import './MeetingCom.css';
import Navbar from '../Navbar/Navbar';

const MeetingCom = () => {
    const [meeting, setMeeting] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sessionName: '',
        description: '',
        date: '',
        time: ''
    });

    // Check if redirected back from Zoom OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://mentors-connect-1-m3po.onrender.com/api/sessionInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // ⚠️ CRITICAL: Enable cookies/session
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.redirect) {
                // Redirect to Zoom OAuth
                console.log("✅ Redirecting to Zoom...");
                window.location.href = "https://mentors-connect-1-m3po.onrender.com/zoom/auth";
            } else {
                setError(data.message || "Failed to save session details");
                setLoading(false);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("Server error occurred");
            setLoading(false);
        }
    };

    // Fetch meeting data after successful OAuth redirect
    useEffect(() => {
        if (success === 'true') {
            setLoading(true);
            fetch("https://mentors-connect-1-m3po.onrender.com/api/meeting-data", {
                credentials: "include"
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Meeting data not found");
                    return res.json();
                })
                .then((data) => {
                    console.log("🎉 Meeting data loaded:", data);
                    setMeeting(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error loading meeting:", err);
                    setError("Could not load meeting data.");
                    setLoading(false);
                });
        }
    }, [success]);

    const extractMeetingId = (joinUrl) => {
        const match = joinUrl.match(/\/j\/(\d+)/);
        return match ? match[1] : 'Unavailable';
    };

    return (
        <>
            <Navbar />
            <div className="host-container">
                {/* Show form if no meeting created yet */}
                {!success && !meeting && (
                    <>
                        <h2>Schedule a Session</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading && <p>Redirecting to Zoom...</p>}

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
                            <button type="submit" className="host-button" disabled={loading}>
                                {loading ? 'Processing...' : 'Create the meeting'}
                            </button>
                        </form>
                    </>
                )}

                {/* Show loading state */}
                {loading && success === 'true' && (
                    <div>Loading your meeting details...</div>
                )}

                {/* Show meeting details after creation */}
                {meeting && (
                    <>
                        <h2>✅ Zoom Meeting Created Successfully!</h2>
                        <div className="host-box">
                            <p><strong>📋 Topic:</strong> {meeting.topic}</p>
                            <p><strong>🔗 Join Link:</strong> <a href={meeting.join_url} target="_blank" rel="noreferrer">{meeting.join_url}</a></p>
                            <p><strong>🆔 Meeting ID:</strong> {extractMeetingId(meeting.join_url)}</p>
                            <p><strong>🔒 Password:</strong> {meeting.password}</p>
                            <p><strong>🕐 Start Time:</strong> {new Date(meeting.start_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
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
                                <button className="host-button">Start Meeting</button>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MeetingCom;
