import {React,useState} from 'react'
import './LoginCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const LoginCom = () => {
  const [email, setEmail] = useState('');
  const [password , setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    try{
      const response = await axios.post(
        'http://localhost:3000/login',
        {email , password},
        {withCredentials : true}
      );

      if(response.status === 200){
        alert("Login Successfull")
        navigate('/');
      }

    }catch(err){
      if(err.response){
        alert(err.response.data.message);
      }else{
        alert("An error occured. Please try again");
      }
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <img src={loginpic} alt="Login Visual" />
      </div>

      <div className="login-container">
        <div className="logo-text">
          <div className="logo1">
            <img src={logo} alt="" />
            <h1>MargDarshak</h1>
          </div>
          <p>Connecting Learners with Industry Experts: A Mentor Discovery Platform for Career Growth</p>
        </div>
        
        <div className="login-box">
            <h2>Login to Your Account</h2>
            <form className="login-form" onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            </form>
            <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
      </div>
    </div>
  )
}

export default LoginCom
