import React, { useState } from 'react'
import MentorLeft from '../../Component/MentorLeft/MentorLeft.jsx'
import Navbar from '../../Component/Navbar/Navbar.jsx'
import MentorRight from '../../Component/MentorRight/MentorRight.jsx'

export const mentorContext = React.createContext()

const Mentor = () => {

  let [mentorsData, setMentorsData] = useState([])

  return (
    <mentorContext.Provider value={[mentorsData, setMentorsData]} >
      <div>
        <Navbar></Navbar>
        <div className="main-content">
          <MentorLeft />
          <MentorRight />
        </div>
      </div>
    </mentorContext.Provider>
  )
}

export default Mentor
