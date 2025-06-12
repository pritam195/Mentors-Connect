import React, { useState } from 'react'
import './SignUpCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SignUpCom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name : '',
    username : '',
    mobno : '',
    email : '' ,
    password : '',
    confirmPassword : '',
    gender : '',
    dob : '',
    agree : false
  });

  const handleChange = (e) => {
    const {name , value, type , checked} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type ==='checkbox'? checked : value
    }));
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(formData.password != formData.confirmPassword){
      alert("Password do not match");
      return;
    }
    if(!formData.agree){
      alert("You must agree to the terms and conditions")
      return;
    }

    try{
      const response = await axios.post(
        'http://localhost:3000/create',
        {
          name : formData.name,
          username : formData.username,
          mobno : formData.mobno,
          email : formData.email,
          password : formData.password,
          gender : formData.gender,
          dob : formData.dob
        },
        { withCredentials : true}
      );
      console.log("User Created :", response.data);
      alert("Account created successfully!");
      navigate('/');
    }catch(err){
      console.error("Signup failed", err.response?.data || err.message);
      alert("Signup failed. Try again");
    }
  };

  return (
    <div className="signup-main-container">
      {/* Left section */}
      <div className="signup-left">
        <img src={loginpic} alt="Mentorship" className="side-img" />
      </div>

      {/* Right section - form */}
      <div className="signup-right">
        <div className="logo-text">
          <div className="logo1">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="site-name">MentorConnect</h1>
          </div>
          <p className="site-tagline">Meet Your Mentor: Bridging the Gap Between Aspiration and Experience</p>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>

          {/* Row 1: Name */}
          <div className="form-row">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          </div>

          {/* Row 2: Username & Mobile */}
          <div className="form-row">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="tel" name="mobno" placeholder="Mobile Number" value={formData.mobno} onChange={handleChange} required />
          </div>

          {/* Row 3: Email */}
          <div className="form-row">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="form-row">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {/* Row 5: Gender & DOB */}
          <div className="form-row">
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>

          {/* Row 6: Checkbox */}
          <div className="form-row checkbox-row">
            <div className='checkbox'>
              <input type="checkbox" name="agree" value={formData.agree} onChange={handleChange} required />
              <span>I agree to the terms and conditions </span> 
            </div>
          </div>

          {/* Row 7: Submit Button */}
          <div className="form-row">
            <button type="submit">Sign Up</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default SignUpCom

