import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LiaEditSolid } from "react-icons/lia"
import { MdDone } from "react-icons/md"
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
    <div>
      {name === username ?
        <div className="profile-container">
          <div className="personal-info">
            <img src={userInfo.profile_photo} alt="profile_photo" />
            {isProfilePhotoEditing ?
              <div>
                <input type='file' onChange={(e) => setNewProfilePhoto(e.target.files[0])} />
                <MdDone onClick={() => { setIsProfilePhotoEditing(false); handleSaveProfileChanges() }} />
              </div>
              :
              <div>
                <LiaEditSolid onClick={() => setIsProfilePhotoEditing(true)} />
              </div>
            }
            <div className="personal-info-text">
              <h2>Name <span> {userInfo.name} </span></h2>
              <h2>Username <span> {userInfo.username} </span></h2>
              <h2>Email <span>{userInfo.email}</span></h2>
              <h2>Mobile No <span>{userInfo.mobno}</span></h2>
              <h2>Bio</h2>
              {isBioEditing ?
                <div>
                  <input autoFocus value={userBio.bio} onChange={(e) => handleInputChange(e, "bio")} />
                  <MdDone onClick={() => { setIsBioEditing(false); handleSaveBioChanges() }} />
                </div>
                :
                <div>
                  <span>{userBio.bio}</span>
                  <LiaEditSolid onClick={() => setIsBioEditing(true)} />
                </div>
              }
              <h2>Resume</h2>
              {isResumeEditing ?
                <div>
                  <input autoFocus value={userBio.resume} onChange={(e) => handleInputChange(e, "resume")} />
                  <MdDone onClick={() => { setIsResumeEditing(false); handleSaveBioChanges() }} />
                </div>
                :
                <div>
                  {userBio.resume &&
                    <a href={userBio.resume} target='_blank' rel="noopener noreferrer" >Check</a>
                  }
                  <LiaEditSolid onClick={() => setIsResumeEditing(true)} />
                </div>
              }
            </div>
          </div>

          <div className="professional-info">
            <div className="box1">
              <h2 className='education'>Education detail</h2 >
              {isEducationEditing ?
                <div>
                  {(userBio.educational_details.length === 0 ? [{ standard: "", marks: "", institution: "", institution_address: "" }] : userBio.educational_details).map((detail, i) => (
                    <div key={i}>
                      <p>Standard</p>
                      <input autoFocus value={detail.standard} onChange={(e) => handleInputChange(e, "standard", i)} />
                      <p>Marks</p>
                      <input value={detail.marks} onChange={(e) => handleInputChange(e, "marks", i)} />
                      <p>Institution</p>
                      <input value={detail.institution} onChange={(e) => handleInputChange(e, "institution", i)} />
                      <p>Institution Address</p>
                      <input value={detail.institution_address} onChange={(e) => handleInputChange(e, "institution_address", i)} />
                    </div>
                  ))}
                  <button onClick={() => handleAddExtraField("education")}>Add Education</button>
                  <MdDone onClick={() => { setIsEducationEditing(false); handleSaveBioChanges(); }} />
                </div>
                :
                <div>
                  <ul>
                    {userBio.educational_details.map((detail, i) =>
                      <li key={i} >{detail.standard} : {detail.marks} % <br /> {detail.institution}, {detail.institution_address}</li>
                    )}
                  </ul>
                  <LiaEditSolid onClick={() => setIsEducationEditing(true)} />
                </div>
              }

              <h2 className='social-links'>Social links</h2>
              {isSocialLinksEditing ?
                <div>
                  {(userBio.social_links.length === 0 ? [{ name: "", link: "" }] : userBio.social_links).map((detail, i) => (
                    <div key={i}>
                      <p>Name</p>
                      <input autoFocus value={detail.name} onChange={(e) => handleInputChange(e, "name", i)} />
                      <p>Link</p>
                      <input value={detail.link} onChange={(e) => handleInputChange(e, "link", i)} />
                    </div>
                  ))}
                  <button onClick={() => handleAddExtraField("social_links")}>Add Link</button>
                  <MdDone onClick={() => { setIsSocialLinksEditing(false); handleSaveBioChanges(); }} />
                </div>
                :
                <div>
                  <ul>
                    {userBio.social_links.map((detail, i) =>
                      <li key={i} >
                        <a href={detail.link} >{detail.name}</a>
                      </li>
                    )}
                  </ul>
                  <LiaEditSolid onClick={() => setIsSocialLinksEditing(true)} />
                </div>
              }
              <h2 className="Meeting-info"> Meeting Info</h2>
              <li>Number of Followers : 1 Million+ </li>
              <li>Meeting Held : 101 </li>
              <li>Likes : 10 Million</li>
              <li>Dislikes : 1 Thousand</li>

            </div>
            <h2>Work Experience</h2>
            {isWorkExpEditing ?
              <div>
                {userBio.work_experience.map((detail, i) => (
                  <div key={i}>
                    <p>company_name</p>
                    <input autoFocus value={detail.company_name} onChange={(e) => handleInputChange(e, "company_name", i)} />
                    <p>Role</p>
                    <input value={detail.role} onChange={(e) => handleInputChange(e, "role", i)} />
                    <p>Place</p>
                    <input value={detail.place} onChange={(e) => handleInputChange(e, "place", i)} />
                    <p>Duration</p>
                    <input value={detail.duration} onChange={(e) => handleInputChange(e, "duration", i)} />
                    <p>Features</p>
                    {detail.features.map((feature, j) =>
                      <input autoFocus key={j} value={feature} onChange={(e) => handleInputChange(e, "feature", i, j)} />
                    )}
                    <button onClick={() => handleAddExtraField("feature", i)}>Add Feature</button>
                  </div>
                ))}
                <button onClick={() => handleAddExtraField("workExp")}>Add Experience</button>
                <MdDone onClick={() => { setIsWorkExpEditing(false); handleSaveBioChanges(); }} />
              </div>
              :
              <div>
                <ul>
                  {userBio.work_experience.map((detail, i) =>
                    <li key={i} >
                      <p>company_name: {detail.company_name}</p>
                      <p>Role: {detail.role}</p>
                      <p>Place: {detail.place}</p>
                      <p>Duration: {detail.duration}</p>
                      {detail.features.map((feature, j) =>
                        <div key={j} >
                          <p>Feature {j + 1}: {feature}</p>
                        </div>
                      )}
                    </li>
                  )}
                </ul>
                <LiaEditSolid onClick={() => setIsWorkExpEditing(true)} />
              </div>
            }
          </div>
        </div>
        :
        <div className="profile-container">
          <div className="personal-info">
            <img src={userInfo.profile_photo} alt="profile_photo" />
            <div className="personal-info-text">
              <h2>Name <span> {userInfo.name} </span></h2>
              <h2>Username <span> {userInfo.username} </span></h2>
              <h2>Email <span>{userInfo.email}</span></h2>
              <h2>Mobile No <span>{userInfo.mobno}</span></h2>
              <h2>Bio</h2>
              <span>{userBio.bio}</span>
              <h2>Resume</h2>
              {userBio.resume &&
                <a href={userBio.resume} target='_blank' rel="noopener noreferrer" >Check</a>
              }
            </div>
          </div>

          <div className="professional-info">
            <div className="box1">
              <h2 className='education'>Education detail</h2 >
              <ul>
                {userBio.educational_details.map((detail, i) =>
                  <li key={i} >{detail.standard} : {detail.marks} % <br /> {detail.institution}, {detail.institution_address}</li>
                )}
              </ul>

              <h2 className='social-links'>Social links</h2>
              <ul>
                {userBio.social_links.map((detail, i) =>
                  <li key={i} >
                    <a href={detail.link} >{detail.name}</a>
                  </li>
                )}
              </ul>
              <h2 className="Meeting-info"> Meeting Info</h2>
              <li>Number of Followers : 1 Million+ </li>
              <li>Meeting Held : 101 </li>
              <li>Likes : 10 Million</li>
              <li>Dislikes : 1 Thousand</li>

            </div>
            <h2>Work Experience</h2>
            <ul>
              {userBio.work_experience.map((detail, i) =>
                <li key={i} >
                  <p>company_name: {detail.company_name}</p>
                  <p>Role: {detail.role}</p>
                  <p>Place: {detail.place}</p>
                  <p>Duration: {detail.duration}</p>
                  {detail.features.map((feature, j) =>
                    <div key={j} >
                      <p>Feature {j + 1}: {feature}</p>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default ProfileCom
