import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import profile from '../../assets/profile.jpg';
import logo from '../../assets/logo.png';
import { Context } from '../../App';

const Navbar = () => {
  const { username, setUsername } = useContext(Context); // You may need setUsername
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/verify-auth', {
          method: 'GET',
          credentials: 'include', // CRITICAL: Sends cookies with request
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
          setIsLoggedIn(true);
          // Optionally update username from response
          // setUsername(data.username);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="" />
          <h1 className="logocolor">MargDarshak</h1>
        </div>
        <div className="nav-links">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/mentor">Mentors</a></li>
            <li><a href="/chat">Chats</a></li>
            <li><a href="/meetings">Meeting</a></li>
          </ul>
        </div>
        <div className="profile">
          <a href={`/${username}/profile`}><img src={profile} alt="" /></a>
          {isLoggedIn ? (
            <button className='button' onClick={handleLogout}>Logout</button>
          ) : (
            <button><a className='button' href="/login">Login</a></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
