import React from 'react'
import './ProfileCom.css'
import profileimage from '../../assets/profileimage.jpg'

const ProfileCom = () => {
  return (
    <div className="profile-container">
      <div className="personal-info">
        <img src={profileimage} alt="" />
        <div className="personal-info-text">
          <h2>Name <span> Pritam Chavan </span></h2>
          <h2>Username <span> pritam_19 </span></h2>
          <h2>Email <span>chavanpritam172@gmail.com</span></h2>
          <h2>Mobile No <span>9130238226</span></h2>
          <h2>Bio <span>Hey Guys , Myself Pritam Chavan, currently i am working at google india . When i was in my college i had my brother to guide me but not everyone get such guidance so for that reason i have made this platform to guide the student and give them the insights about the corporate life</span></h2>
          <h2>Resume  <button>check</button> </h2>
        </div>
      </div>

      <div className="professional-info">
        <div className="box1">
          <h2 className='education'>Education detail 
            <span>
              <ul>
                <li>Class X : 89.2 % <br /> P. G. Public Nandurbar</li>
                <li>Class XII : 79 % <br /> P. G. Public Nandurbar</li>
                <li>BTech EXTC : 8.0 CGPA <br /> VJTI Mumbai </li>
              </ul>
            </span>
          </h2 >
          <h2 className='social-links'>Social links
            <span>
              <li><a href="#">Github</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
            </span>
          </h2>
          <h2 className="Meeting-info"> Meeting Info
            <span>
              <li>Number of Followers : 1 Million+ </li>
              <li>Meeting Held : 101 </li>
              <li>Likes : 10 Million</li>
              <li>Dislikes : 1 Thousand</li>
            </span>
          </h2>

        </div>
        <h2>Work Experience 
          <span>Google  <br />  Software Engineer | Bangalore | July 2023 - Present  <br /> 
        <li>Built scalable backend services for Google Maps, improving performance by 25%.</li>
        <li>Led a team of 5 to redesign internal tools using React and gRPC.</li>
        <li>Integrated ML APIs for predictive routing and mentored junior engineers.</li>
        </span>
        <span>Microsoft <br /> Software Engineer | Hyderabad | July 2021 - June 2023 <br /> 
        <li>Developed features for Microsoft Teams using .NET Core and Azure.</li>
        <li>Improved authentication speed and security with Azure AD integration</li>
        <li>Launched chat enhancements used by 100M+ users and ensured 98% test coverage.</li>
        </span>
        </h2>

      </div>
    </div>
  )
}

export default ProfileCom
