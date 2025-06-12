import React from 'react'
import './ChatLeft.css'
import profileimage from '../../assets/profileimage.jpg'
import search from '../../assets/search.png'

const ChatLeft = () => {
  return (
    <div className="chatleft">
        <div className="search-bar">
            <img src={search} alt="" />
            <input type="text" placeholder='Search here'/>
        </div>

        <div className="mentees-container">
            <div className="person1">
                <img src={profileimage} alt="" />
                <h2>Pritam Chavan</h2>
            </div>
            <div className="person1">
                <img src={profileimage} alt="" />
                <h2>Pritam Chavan</h2>
            </div>
            <div className="person1">
                <img src={profileimage} alt="" />
                <h2>Pritam Chavan</h2>
            </div>
            <div className="person1">
                <img src={profileimage} alt="" />
                <h2>Pritam Chavan</h2>
            </div>
            <div className="person1">
                <img src={profileimage} alt="" />
                <h2>Pritam Chavan</h2>
            </div>
        </div>
    </div>
  )
}

export default ChatLeft
