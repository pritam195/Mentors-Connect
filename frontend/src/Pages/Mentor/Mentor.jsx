import React from 'react'
import MentorLeft from '../../Component/MentorLeft/MentorLeft.jsx'
import Navbar from '../../Component/Navbar/Navbar.jsx'
import MentorRight from '../../Component/MentorRight/MentorRight.jsx'

const Mentor = () => {
  return (
    <div>
        <Navbar></Navbar>
        <div className="main-content">
            <MentorLeft />
            <MentorRight />
        </div>
    </div>
  )
}

export default Mentor
