import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom"; // No Router here!
import './App.css';
import Home from './Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx';
import SignUp from './Pages/SignUp/SignUp.jsx';
import Mentor from './Pages/Mentor/Mentor.jsx';
import Chat from './Pages/Chat/Chat.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import MeetingCom from './Component/MeetingCom/MeetingCom.jsx';
import Meetings from './Pages/Meeting/Meeting.jsx';

export const Context = React.createContext();

const App = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function handleFetchUsername() {
      try {
        const response = await fetch("http://localhost:3000/get_username", {
          method: "GET",
          credentials: "include"
        });
        if (response.status === 200) {
          let data = await response.json();
          if (data) {
            setUsername(data.username);
          }
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    }
    handleFetchUsername();
  }, []);

  return (
    <Context.Provider value={{ username, setUsername }}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/:name/profile" element={<Profile />} />
        <Route path='/meetings' element={<Meetings/>} />
        <Route path="/host-meeting" element={<MeetingCom />} />
      </Routes>
    </Context.Provider>
  );
};

export default App;



