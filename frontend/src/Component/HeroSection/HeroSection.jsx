import React from 'react'
import './HeroSection.css'
import HeroImage from '../../assets/hero3.jpg'
import career from '../../assets/career.jpg'
import secure from '../../assets/secure.jpg'
import chatapp from '../../assets/chat app.png'
import videocall from '../../assets/video.jpg'
import mentor from '../../assets/mentor.jpg'
import mobile from '../../assets/image.png'

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
      {/* Our Highlighted Features */}
    <div className="features">
        <div className="feature-card">
          <img src={mentor} alt="" />
          <h3>Mentor Discovery</h3>
          <p>Mentees can explore a curated list of industry experts and subject matter specialists based on their skills, interests, or goals. Each mentor profile showcases their expertise, experience, and availability.</p>
        </div>

          <div className="feature-card">
            <img src={mobile} alt="" />
            <h3>Mobile-First Design</h3>
            <p>Fully responsive platform optimized for mobile devices. Access mentoring sessions, chat, and resources seamlessly across desktop, tablet, and smartphone platforms.</p>
          </div>


          <div className="feature-card">
            <img src={videocall} alt="" />
            <h3>Zoom Meeting Creation</h3>
            <p>Seamlessly create and schedule Zoom meetings directly through the platform using Zoom API integration. Mentors and mentees can generate meeting links instantly for their sessions.</p>
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

    </>
  )
}

export default HeroSection
