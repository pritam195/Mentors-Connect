import React from 'react'
import './HeroSection.css'
import HeroImage from '../../assets/hero3.jpg'
import acb from '../../assets/acb.png'
import career from '../../assets/career.jpg'
import secure from '../../assets/secure.jpg'
import chatapp from '../../assets/chat app.png'
import videocall from '../../assets/video.jpg'
import mentor from '../../assets/mentor.jpg'
import piyush from '../../assets/piyush.jpg'
import prasad from '../../assets/prasad.jpg'
import sahil from '../../assets/sahil.jpg'
import susu from '../../assets/susurut.jpg'

const HeroSection = () => {
  return (
    <>
  <div className="hero-section">
      <img src={HeroImage} alt="Mentor" />
    <div className="hero-text">
          <h3>
            <span className="highlight">A mentor</span> plays the role of a
            <br />
            <span className="emphasis">trusted guide</span> who shares
            <br />
            knowledge, experience, and support
            <br />
            to help someone <span className="highlight">grow</span> personally
            <br />
            and professionally.
          </h3>
      </div>
    </div>

    <div className="feature-section">
      Our Highlighted Features
    <div className="features">
        <div className="feature-card">
          <img src={mentor} alt="" />
          <h3>Mentor Discovery</h3>
          <p>Mentees can explore a curated list of industry experts and subject matter specialists based on their skills, interests, or goals. Each mentor profile showcases their expertise, experience, and availability.</p>
        </div>

        <div className="feature-card">
          <img src={acb} alt="" />
          <h3>Automated Calendar Booking</h3>
          <p>The platform includes an integrated booking system that checks mentors’ availability and allows mentees to schedule sessions with just a few clicks. Optional integration with tools like Calendly for seamless calendar sync.</p>
        </div>

        <div className="feature-card">
          <img src={videocall} alt="" />
          <h3>Embedded Video Calling</h3>
          <p>Secure and built-in video calling functionality enables virtual face-to-face mentoring sessions. No need for external apps — everything happens on the platform.</p>
        </div>

        <div className="feature-card">
          <img src={career} alt="" />
          <h3>Career Guidance & Skill Development</h3>
          <p>Mentors provide personalized support including career path advice, resume reviews, mock interviews, and guidance on industry-relevant skills to help mentees succeed.</p>
        </div>

        <div className="feature-card">
          <img src={chatapp} alt="" />
          <h3>Real-Time Chat</h3>
          <p>During or outside of meetings, mentees and mentors can chat to share links, documents, resources, or follow-up questions. Chat is intuitive and supports file sharing.</p>
        </div>

        <div className="feature-card">
          <img src={secure} alt="" />
          <h3>Secure & User-Friendly Platform</h3>
          <p>Built with privacy and ease of use in mind, the platform ensures smooth onboarding, responsive design, and secure communication for all users.</p>
        </div>
    </div>
    </div>

    <div className="mentor-card-container">
      <h2>Some of the most Popular Mentors</h2>
      <div className="mentor-card-container">
        <div className="mentor-card">
          <img src={piyush} alt="" />
          <h3>Name : Piyush Batavale</h3>
          <p>Job Profile : SDE Google</p>
          <p>Years of Exp. : 4 years</p>
          <p>Followers : 5M </p>
          <p>Click here for more <a href="#">details</a></p>
        </div>

        <div className="mentor-card">
          <img src={sahil} alt="" />
          <h3>Name : Sahil Khot</h3>
          <p>Job Profile : SDE Microsoft</p>
          <p>Years of Exp. : 4 years</p>
          <p>Followers : 2M </p>
          <p>Click here for more <a href="#">details</a></p>
        </div>

        <div className="mentor-card">
          <img src={prasad} alt="" />
          <h3>Name : Prasad Joshi</h3>
          <p>Job Profile : SDE JPMC</p>
          <p>Years of Exp. : 4 years</p>
          <p>Followers : 10M </p>
          <p>Click here for more <a href="#">details</a></p>
        </div>

        <div className="mentor-card">
          <img src={susu} alt="" />
          <h3>Name : Sushurut Deshpande</h3>
          <p>Job Profile : SDE Goldman Sach</p>
          <p>Years of Exp. : 4 years</p>
          <p>Followers : 8M </p>
          <p>Click here for more <a href="#">details</a></p>
        </div>
      </div>
    </div>

    </>
  )
}

export default HeroSection
