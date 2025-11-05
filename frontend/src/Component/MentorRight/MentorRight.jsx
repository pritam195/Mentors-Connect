import React, { useContext, useEffect, useState } from 'react';
import './MentorRight.css';
import { mentorContext } from '../../Pages/Mentor/Mentor';
import { Context } from '../../App';
import { useNavigate } from 'react-router-dom';

const MentorRight = () => {
    const navigate = useNavigate();
    const { username } = useContext(Context);
    const [mentorsData, setMentorsData] = useContext(mentorContext);

    useEffect(() => {
        async function handleFetchMentorsData() {
            try {
                const response = await fetch("http://localhost:3000/mentor", {
                    method: "GET"
                });
                if (response.ok) {
                    let data = await response.json();
                    if (data)
                        setMentorsData(data);
                }
            } catch (error) {
                alert("An error occurred. Please try again.");
                navigate("/");
            }
        }
        handleFetchMentorsData();
    }, [username]);

    return (
        <div className='right-container'>
            <div className="card-container">
                {mentorsData.length > 0 ? (
                    mentorsData.map((mentor, i) => (
                        <div key={mentor._id || i} className="card">
                            <div className="card-image">
                                <img src={mentor.profile_photo} alt={mentor.name} />
                                <p className='p'>Mentor Available</p>
                            </div>
                            <div className="card-text">
                                <h2>Name: {mentor.name}</h2>
                                {mentor.work_experience && mentor.work_experience[0] && (
                                    <>
                                        <h4>Job Role: {mentor.work_experience[0].role}</h4>
                                        <h4>Company: {mentor.work_experience[0].company_name}</h4>
                                        <h4>Years of Experience: {mentor.work_experience[0].duration}</h4>
                                        <h4>Location: {mentor.work_experience[0].place}</h4>
                                    </>
                                )}
                                <button><a href={`/${mentor.username}/profile`}>View Profile</a></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No mentors found</p>
                )}
            </div>
        </div>
    );
};

export default MentorRight;
