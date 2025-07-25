import React, { useContext, useState } from 'react'
import './MentorLeft.css'
import search from '../../assets/search.png'
import { mentorContext } from '../../Pages/Mentor/Mentor'

const MentorLeft = () => {

  let [mentorSearch, setMentorSearch] = useState("")
  let [mentorsData, setMentorsData] = useContext(mentorContext)
  let [filters, setFilters] = useState({
    company: [],
    year_of_exp: [],
    location: []
  })

  async function fetchMentors(value, filters) {
    try {
      let response = await fetch("https://mentors-connect-zh64.onrender.com/mentor", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ mentorSearch: value, filters })
      })
      if (response.ok) {
        let data = await response.json()
        setMentorsData(data)
      }
    }
    catch (error) {
      alert("An error occurred. Please refresh and try again.");
      navigate("/")
    }
  }

  function handleSearchChange(e) {
    let value = e.target.value
    setMentorSearch(value)
    if (value.trim() === "") {
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
    }
    else
      fetchMentors(value, filters)
  }

  function toggleFilter(category, value) {
    setFilters(prev => {
      let current = prev[category]
      let updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      let newFilters = { ...prev, [category]: updated }
      fetchMentors(mentorSearch, newFilters)
      return newFilters
    })
  }

  return (
    <div className='left-container'>
      <div className="left-header">
        <h2>Filter the Mentors</h2>
        <div className="search-box">
          <img src={search} alt="" />
          <input type="text" value={mentorSearch} onChange={(e) => handleSearchChange(e)} placeholder='search here' />
        </div>
      </div>

      <div className="left-body">
        {/* Filter Section - Company */}
        <div className="filter-section">
          <h3>Based on Company</h3>
          <ul className="filter-options">
            {["Microsoft", "Google", "Adobe", "Deloitte", "L&T", "AsianPaints", "ICICI Bank", "Philips", "Apple", "Vivo", "Intel", "Others"].map(company =>
              <li key={company} className={filters.company.includes(company) ? "selected" : ""} onClick={() => toggleFilter("company", company)} >{company}</li>
            )}
          </ul>
        </div>

        {/* Filter Section - Experience */}
        <div className="filter-section">
          <h3>Based on the Year of Experience</h3>
          <ul className="filter-options">
            {["Less than 1 year", "1+ year", "2+ years", "3+ years", "5+ years", "10+ years"].map(year => (
              <li key={year} className={filters.year_of_exp.includes(year) ? "selected" : ""} onClick={() => toggleFilter("year_of_exp", year)} >{year}</li>
            ))}
          </ul>
        </div>

        {/* Filter Section - Location */}
        <div className="filter-section">
          <h3>Based on the Location</h3>
          <ul className="filter-options">
            {["Mumbai", "Pune", "Hyderabad", "New Delhi", "Bangalore", "Ahmedabad", "Others"].map(city => (
              <li key={city} className={filters.location.includes(city) ? "selected" : ""} onClick={() => toggleFilter("location", city)} >{city}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

  )
}

export default MentorLeft
