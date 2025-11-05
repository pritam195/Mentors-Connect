import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LiaEditSolid } from "react-icons/lia"
import { MdDone, MdEmail, MdPhone, MdLocationOn, MdWork, MdSchool } from "react-icons/md"
import './ProfileCom.css'
import { Context } from "../../App"

const ProfileCom = () => {
  let navigate = useNavigate()
  let { username } = useContext(Context)
  let { name } = useParams()
  let [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    mobno: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    profile_photo: null
  })
  let [userBio, setUserBio] = useState({
    username: "",
    name: "",
    bio: "",
    resume: "",
    profile_photo: "",
    educational_details: [{
      standard: "",
      marks: "",
      institution: "",
      institution_address: ""
    }],
    social_links: [{
      name: "",
      link: ""
    }],
    work_experience: [{
      company_name: "",
      role: "",
      place: "",
      duration: "",
      features: [""]
    }]
  })

  let [newProfilePhoto, setNewProfilePhoto] = useState("")
  let [isBioEditing, setIsBioEditing] = useState(false)
  let [isResumeEditing, setIsResumeEditing] = useState(false)
  let [isEducationEditing, setIsEducationEditing] = useState(false)
  let [isSocialLinksEditing, setIsSocialLinksEditing] = useState(false)
  let [isWorkExpEditing, setIsWorkExpEditing] = useState(false)
  let [isProfilePhotoEditing, setIsProfilePhotoEditing] = useState(false)

  useEffect(() => {
    async function handleFetchUserInfo() {
      try {
        const response = await fetch(`http://localhost:3000/${name}/profile`, {
          method: "GET"
        })
        if (response.ok) {
          let { userInfo, userBio } = await response.json()
          if (userInfo)
            setUserInfo(userInfo)
          if (userBio)
            setUserBio(userBio)
        }
      }
      catch (error) {
        alert("An error occurred. Please try again.");
        navigate("/")
      }
    }
    handleFetchUserInfo()
  }, [username, userBio.profile_photo])

  function handleInputChange(e, name, i, j) {
    if (name === "bio")
      setUserBio(prev => ({ ...prev, bio: e.target.value }))
    else if (name === "resume")
      setUserBio(prev => ({ ...prev, resume: e.target.value }))
    else if (["standard", "marks", "institution", "institution_address"].includes(name)) {
      let updatedDetails = [...userBio.educational_details]
      updatedDetails[i] = { ...updatedDetails[i], [name]: e.target.value }
      setUserBio(prev => ({ ...prev, educational_details: updatedDetails }))
    }
    else if (["name", "link"].includes(name)) {
      let updatedLinks = [...userBio.social_links]
      updatedLinks[i] = { ...updatedLinks[i], [name]: e.target.value }
      setUserBio(prev => ({ ...prev, social_links: updatedLinks }))
    }
    else if (["company_name", "role", "place", "duration"].includes(name)) {
      let updatedWorkExp = [...userBio.work_experience]
      updatedWorkExp[i] = { ...updatedWorkExp[i], [name]: e.target.value }
      setUserBio(prev => ({ ...prev, work_experience: updatedWorkExp }))
    }
    else if (name === "feature" && j !== null) {
      let updatedWorkExp = [...userBio.work_experience]
      let updatedFeatures = [...updatedWorkExp[i].features]
      updatedFeatures[j] = e.target.value
      updatedWorkExp[i].features = updatedFeatures
      setUserBio(prev => ({ ...prev, work_experience: updatedWorkExp }))
    }
  }

  function handleAddExtraField(name, i) {
    if (name === "education") {
      setUserBio(prev => ({
        ...prev, educational_details: [...prev.educational_details, {
          standard: "",
          marks: "",
          institution: "",
          institution_address: ""
        }]
      }))
    }
    else if (name === "social_links") {
      setUserBio(prev => ({
        ...prev, social_links: [...prev.social_links, {
          name: "",
          link: ""
        }]
      }))
    }
    else if (name === "workExp") {
      setUserBio(prev => ({
        ...prev, work_experience: [...prev.work_experience, {
          company_name: "",
          role: "",
          place: "",
          duration: "",
          features: []
        }]
      }))
    }
    else if (name === "feature") {
      let updated = [...userBio.work_experience]
      updated[i].features.push("")
      setUserBio(prev => ({ ...prev, work_experience: updated }))
    }
  }

  async function handleSaveBioChanges() {
    let filledEducation = userBio.educational_details.filter(detail =>
      detail.standard.trim() !== "" ||
      detail.marks.trim() !== "" ||
      detail.institution.trim() !== "" ||
      detail.institution_address.trim() !== ""
    )
    let filledSocialLinks = userBio.social_links.filter(link =>
      link.name.trim() !== "" || link.link.trim() !== ""
    )
    let filledWorkExperience = userBio.work_experience.filter(exp =>
      exp.company_name.trim() !== "" ||
      exp.role.trim() !== "" ||
      exp.place.trim() !== "" ||
      exp.duration.trim() !== "" ||
      exp.features.some(f => f.trim() !== "")
    ).map(exp => ({
      ...exp,
      features: exp.features.filter(f => f.trim() !== "")
    }))

    let filteredUserBio = {
      ...userBio,
      educational_details: filledEducation,
      social_links: filledSocialLinks,
      work_experience: filledWorkExperience
    }

    try {
      let response = await fetch(`http://localhost:3000/${username}/profile`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ userBio: filteredUserBio })
      })
      if (response.ok) {
        setUserBio(filteredUserBio)
      }
    }
    catch (error) {
      alert("An error occurred. Please refresh and try again.");
      navigate("/")
    }
  }

  async function handleSaveProfileChanges() {
    let formData = new FormData()
    formData.append("profile_photo", newProfilePhoto)
    try {
      let response = await fetch(`http://localhost:3000/${username}/profile/profile-photo`, {
        method: "POST",
        body: formData
      })
      if (response.ok) {
        setUserBio(prev => ({ ...prev, profile_photo: URL.createObjectURL(newProfilePhoto) }))
      }
    }
    catch (error) {
      alert("An error occurred. Please refresh and try again.");
      navigate("/")
    }
  }

  return (
    <div className="profile-wrapper">
      {name === username ? (
        // ============= YOUR OWN PROFILE (Edit Mode) =============
        <div className="profile-container">
          {/* Hero Section */}
          <div className="profile-hero">
            <div className="cover-photo"></div>
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <img src={userInfo.profile_photo} alt="profile" className="profile-avatar" />
                {isProfilePhotoEditing ? (
                  <div className="avatar-edit-active">
                    <input type='file' onChange={(e) => setNewProfilePhoto(e.target.files[0])} />
                    <button className="save-photo-btn" onClick={() => { setIsProfilePhotoEditing(false); handleSaveProfileChanges() }}>
                      <MdDone />
                    </button>
                  </div>
                ) : (
                  <button className="avatar-edit-btn" onClick={() => setIsProfilePhotoEditing(true)}>
                    <LiaEditSolid />
                  </button>
                )}
              </div>
              <div className="profile-header-info">
                <h1 className="profile-name">{userInfo.name}</h1>
                <p className="profile-username">@{userInfo.username}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            <div className="profile-sidebar">
              {/* About Card */}
              <div className="info-card">
                <div className="card-header">
                  <h2>About</h2>
                  {isBioEditing ? (
                    <MdDone className="save-icon" onClick={() => { setIsBioEditing(false); handleSaveBioChanges() }} />
                  ) : (
                    <LiaEditSolid className="edit-icon" onClick={() => setIsBioEditing(true)} />
                  )}
                </div>
                <div className="card-body">
                  {isBioEditing ? (
                    <textarea
                      className="bio-textarea"
                      autoFocus
                      value={userBio.bio}
                      onChange={(e) => handleInputChange(e, "bio")}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="bio-text">{userBio.bio || "No bio added yet"}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Contact Info</h2>
                </div>
                <div className="card-body">
                  <div className="contact-item">
                    <MdEmail className="contact-icon" />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="contact-item">
                    <MdPhone className="contact-icon" />
                    <span>{userInfo.mobno}</span>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Resume</h2>
                  {isResumeEditing ? (
                    <MdDone className="save-icon" onClick={() => { setIsResumeEditing(false); handleSaveBioChanges() }} />
                  ) : (
                    <LiaEditSolid className="edit-icon" onClick={() => setIsResumeEditing(true)} />
                  )}
                </div>
                <div className="card-body">
                  {isResumeEditing ? (
                    <input
                      autoFocus
                      className="resume-input"
                      value={userBio.resume}
                      onChange={(e) => handleInputChange(e, "resume")}
                      placeholder="Resume link..."
                    />
                  ) : (
                    userBio.resume ? (
                      <a href={userBio.resume} target="_blank" rel="noopener noreferrer" className="resume-btn">
                        📄 View Resume
                      </a>
                    ) : (
                      <p className="no-data">No resume uploaded</p>
                    )
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Social Links</h2>
                  {isSocialLinksEditing ? (
                    <MdDone className="save-icon" onClick={() => { setIsSocialLinksEditing(false); handleSaveBioChanges() }} />
                  ) : (
                    <LiaEditSolid className="edit-icon" onClick={() => setIsSocialLinksEditing(true)} />
                  )}
                </div>
                <div className="card-body">
                  {isSocialLinksEditing ? (
                    <div className="edit-section">
                      {(userBio.social_links.length === 0 ? [{ name: "", link: "" }] : userBio.social_links).map((detail, i) => (
                        <div key={i} className="input-group">
                          <input placeholder="Platform" value={detail.name} onChange={(e) => handleInputChange(e, "name", i)} />
                          <input placeholder="URL" value={detail.link} onChange={(e) => handleInputChange(e, "link", i)} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={() => handleAddExtraField("social_links")}>+ Add Link</button>
                    </div>
                  ) : (
                    <div className="social-links-list">
                      {userBio.social_links.length > 0 ? (
                        userBio.social_links.map((detail, i) => (
                          <a key={i} href={detail.link} target="_blank" rel="noopener noreferrer" className="social-link">
                            🔗 {detail.name}
                          </a>
                        ))
                      ) : (
                        <p className="no-data">No social links added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-main">
              {/* Education */}
              <div className="info-card">
                <div className="card-header">
                  <h2><MdSchool /> Education</h2>
                  {isEducationEditing ? (
                    <MdDone className="save-icon" onClick={() => { setIsEducationEditing(false); handleSaveBioChanges() }} />
                  ) : (
                    <LiaEditSolid className="edit-icon" onClick={() => setIsEducationEditing(true)} />
                  )}
                </div>
                <div className="card-body">
                  {isEducationEditing ? (
                    <div className="edit-section">
                      {(userBio.educational_details.length === 0 ? [{ standard: "", marks: "", institution: "", institution_address: "" }] : userBio.educational_details).map((detail, i) => (
                        <div key={i} className="education-edit-item">
                          <input placeholder="Degree/Standard" value={detail.standard} onChange={(e) => handleInputChange(e, "standard", i)} />
                          <input placeholder="Marks/GPA" value={detail.marks} onChange={(e) => handleInputChange(e, "marks", i)} />
                          <input placeholder="Institution" value={detail.institution} onChange={(e) => handleInputChange(e, "institution", i)} />
                          <input placeholder="Location" value={detail.institution_address} onChange={(e) => handleInputChange(e, "institution_address", i)} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={() => handleAddExtraField("education")}>+ Add Education</button>
                    </div>
                  ) : (
                    <div className="timeline">
                      {userBio.educational_details.length > 0 ? (
                        userBio.educational_details.map((detail, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <h3>{detail.standard}</h3>
                              <p className="marks">Score: {detail.marks}%</p>
                              <p className="institution">{detail.institution}</p>
                              <p className="location"><MdLocationOn /> {detail.institution_address}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-data">No education details added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="info-card">
                <div className="card-header">
                  <h2><MdWork /> Work Experience</h2>
                  {isWorkExpEditing ? (
                    <MdDone className="save-icon" onClick={() => { setIsWorkExpEditing(false); handleSaveBioChanges() }} />
                  ) : (
                    <LiaEditSolid className="edit-icon" onClick={() => setIsWorkExpEditing(true)} />
                  )}
                </div>
                <div className="card-body">
                  {isWorkExpEditing ? (
                    <div className="edit-section">
                      {userBio.work_experience.map((detail, i) => (
                        <div key={i} className="work-edit-item">
                          <input placeholder="Company Name" value={detail.company_name} onChange={(e) => handleInputChange(e, "company_name", i)} />
                          <input placeholder="Role" value={detail.role} onChange={(e) => handleInputChange(e, "role", i)} />
                          <input placeholder="Location" value={detail.place} onChange={(e) => handleInputChange(e, "place", i)} />
                          <input placeholder="Duration" value={detail.duration} onChange={(e) => handleInputChange(e, "duration", i)} />
                          <label>Key Responsibilities:</label>
                          {detail.features.map((feature, j) => (
                            <input key={j} placeholder={`Responsibility ${j + 1}`} value={feature} onChange={(e) => handleInputChange(e, "feature", i, j)} />
                          ))}
                          <button className="add-feature-btn" onClick={() => handleAddExtraField("feature", i)}>+ Add Responsibility</button>
                        </div>
                      ))}
                      <button className="add-btn" onClick={() => handleAddExtraField("workExp")}>+ Add Experience</button>
                    </div>
                  ) : (
                    <div className="timeline">
                      {userBio.work_experience.length > 0 ? (
                        userBio.work_experience.map((detail, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <h3>{detail.role}</h3>
                              <p className="company">{detail.company_name}</p>
                              <p className="duration">📅 {detail.duration}</p>
                              <p className="location"><MdLocationOn /> {detail.place}</p>
                              {detail.features.length > 0 && (
                                <ul className="features-list">
                                  {detail.features.map((feature, j) => (
                                    <li key={j}>{feature}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-data">No work experience added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ============= OTHER USER'S PROFILE (View Only) =============
        <div className="profile-container">
          {/* Hero Section */}
          <div className="profile-hero">
            <div className="cover-photo"></div>
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <img src={userInfo.profile_photo} alt="profile" className="profile-avatar" />
              </div>
              <div className="profile-header-info">
                <h1 className="profile-name">{userInfo.name}</h1>
                <p className="profile-username">@{userInfo.username}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            <div className="profile-sidebar">
              {/* About Card */}
              <div className="info-card">
                <div className="card-header">
                  <h2>About</h2>
                </div>
                <div className="card-body">
                  <p className="bio-text">{userBio.bio || "No bio available"}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Contact Info</h2>
                </div>
                <div className="card-body">
                  <div className="contact-item">
                    <MdEmail className="contact-icon" />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="contact-item">
                    <MdPhone className="contact-icon" />
                    <span>{userInfo.mobno}</span>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Resume</h2>
                </div>
                <div className="card-body">
                  {userBio.resume ? (
                    <a href={userBio.resume} target="_blank" rel="noopener noreferrer" className="resume-btn">
                      📄 View Resume
                    </a>
                  ) : (
                    <p className="no-data">No resume available</p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="info-card">
                <div className="card-header">
                  <h2>Social Links</h2>
                </div>
                <div className="card-body">
                  <div className="social-links-list">
                    {userBio.social_links.length > 0 ? (
                      userBio.social_links.map((detail, i) => (
                        <a key={i} href={detail.link} target="_blank" rel="noopener noreferrer" className="social-link">
                          🔗 {detail.name}
                        </a>
                      ))
                    ) : (
                      <p className="no-data">No social links available</p>
                    )}
                  </div>
                </div>
                </div>
            </div>

            <div className="profile-main">
              {/* Education */}
              <div className="info-card">
                <div className="card-header">
                  <h2><MdSchool /> Education</h2>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    {userBio.educational_details.length > 0 ? (
                      userBio.educational_details.map((detail, i) => (
                        <div key={i} className="timeline-item">
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h3>{detail.standard}</h3>
                            <p className="marks">Score: {detail.marks}%</p>
                            <p className="institution">{detail.institution}</p>
                            <p className="location"><MdLocationOn /> {detail.institution_address}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No education details available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="info-card">
                <div className="card-header">
                  <h2><MdWork /> Work Experience</h2>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    {userBio.work_experience.length > 0 ? (
                      userBio.work_experience.map((detail, i) => (
                        <div key={i} className="timeline-item">
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h3>{detail.role}</h3>
                            <p className="company">{detail.company_name}</p>
                            <p className="duration">📅 {detail.duration}</p>
                            <p className="location"><MdLocationOn /> {detail.place}</p>
                            {detail.features.length > 0 && (
                              <ul className="features-list">
                                {detail.features.map((feature, j) => (
                                  <li key={j}>{feature}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No work experience available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCom
