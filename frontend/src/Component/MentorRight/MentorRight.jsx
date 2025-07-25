import React, { useContext, useEffect, useState } from 'react'
import './MentorRight.css'
import { mentorContext } from '../../Pages/Mentor/Mentor'
import { Context } from '../../App'

const MentorRight = () => {

    let {username} = useContext(Context)
    let [mentorsData, setMentorsData] = useContext(mentorContext)

    useEffect(() => {
        async function handleFetchMentorsData() {
            try {
                const response = await fetch("https://mentors-connect-zh64.onrender.com/mentor", {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    if (data)
                        setMentorsData(data)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.");
                navigate("/")
            }
        }
        handleFetchMentorsData()
    }, [username])

    return (
        <div className='right-container'>

            <div className="card-container">

                {mentorsData.length > 0 ?
                    <div>
                        {mentorsData.map((mentor, i) =>
                            <div key={i} className="card">
                                <img src={mentor.profile_photo} alt="" />
                                <div className="card-text">
                                    <h2>Name : {mentor.name}</h2>
                                    <h4>Job Role : {mentor.work_experience[0].role}</h4>
                                    <h4>Years of Experience : {mentor.work_experience[0].duration}</h4>
                                    <h4>Location : {mentor.work_experience[0].place}</h4>
                                    <button>Follow</button>
                                    <p>Click here for more <a href={`/${mentor.username}/profile`}>details</a></p>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <p>No mentors found</p>
                }

            </div>

        </div>
    )
}

export default MentorRight
