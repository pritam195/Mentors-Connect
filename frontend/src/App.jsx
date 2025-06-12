import React from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home.jsx'
import Login from './Pages/Login/Login.jsx'
import SignUp from './Pages/SignUp/SignUp.jsx'
import Mentor from './Pages/Mentor/Mentor.jsx'
import Chat from './Pages/Chat/Chat.jsx'
import Profile from './Pages/Profile/Profile.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element= {<SignUp></SignUp>}></Route>
        <Route path='/mentor' element={<Mentor></Mentor>}></Route>
        <Route path='/chat' element={<Chat></Chat>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
    </div>
  )
}

export default App

