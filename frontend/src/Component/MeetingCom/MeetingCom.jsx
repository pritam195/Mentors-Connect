import React, { useEffect, useState } from 'react';
import './MeetingCom.css';

const MeetingCom = () => {
    const [meeting, setMeeting] = useState(null);
    const token = new URLSearchParams(window.location.search).get('token');

    const extractMeetingId = (joinUrl) => {
        const match = joinUrl.match(/\/j\/(\d+)/);
        return match ? match[1] : 'Unavailable';
    };

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:3000/api/create-meeting?token=${token}`)
                .then((res) => res.json())
                .then((data) => setMeeting(data))
                .catch((err) => console.error("Error creating meeting:", err));
        }
    }, [token]);

    if (!token) {
        return (
            <div className="host-container">
                <h3>Connect Zoom to Host a Meeting</h3>
                <a href="http://localhost:3000/zoom/auth">
                    <button className="host-button">Connect Zoom</button>
                </a>
            </div>
        );
    }

    if (!meeting) {
        return <div className="host-container">Creating your meeting...</div>;
    }

    return (
        <div className="host-container">
            <h2>Zoom Meeting Created!</h2>
            <div className="host-box">
                <p><strong>🔗 Join Link:</strong> <a href={meeting.join_url} target="_blank" rel="noreferrer">{meeting.join_url}</a></p>
                <p><strong>🆔 Meeting ID:</strong> {extractMeetingId(meeting.join_url)}</p>
                <p><strong>🔒 Password:</strong> {meeting.password}</p>
                <p><strong>🧑 Your Name:</strong></p>
                <input type="text" placeholder="Enter your name" className="host-input" />
            </div>
        </div>
    );
};

export default MeetingCom;

