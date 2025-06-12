import React from 'react'
import './MentorLeft.css'
import search from '../../assets/search.png'

const MentorLeft = () => {
  return (
    <div className='left-container'>
  <div className="left-header">
    <h2>Filter the Mentors</h2>
    <div className="search-box">
        <img src={search} alt="" />
        <input type="text" placeholder='search here' />
    </div>
  </div>

  <div className="left-body">
    {/* Filter Section - Company */}
    <div className="filter-section">
      <h3>Based on Company</h3>
      <ul className="filter-options">
        <li>Microsoft</li>
        <li>Google</li>
        <li>Adobe</li>
        <li>Deloitte</li>
        <li>L&T</li>
        <li>AsianPaints</li>
        <li>ICICI Bank</li>
        <li>Philips</li>
        <li>Apple</li>
        <li>Vivo</li>
        <li>Intel</li>
        <li>Others</li>
      </ul>
    </div>

    {/* Filter Section - Experience */}
    <div className="filter-section">
      <h3>Based on the Year of Experience</h3>
      <ul className="filter-options">
        <li>Less than 1 year</li>
        <li>1+ year</li>
        <li>2+ years</li>
        <li>3+ years</li>
        <li>5+ years</li>
        <li>10+ years</li>
      </ul>
    </div>

    {/* Filter Section - Location */}
    <div className="filter-section">
      <h3>Based on the Location</h3>
      <ul className="filter-options">
        <li>Mumbai</li>
        <li>Pune</li>
        <li>Hyderabad</li>
        <li>New Delhi</li>
        <li>Bangalore</li>
        <li>Ahmedabad</li>
        <li>Others</li>
      </ul>
    </div>
  </div>
</div>

  )
}

export default MentorLeft
