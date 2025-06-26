import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home.jsx'
import Login from './Pages/Login/Login.jsx'
import SignUp from './Pages/SignUp/SignUp.jsx'
import Mentor from './Pages/Mentor/Mentor.jsx'
import Chat from './Pages/Chat/Chat.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import Meeting from './Pages/Meeting/Meeting.jsx'

export const Context = React.createContext()

const App = () => {

  let [username, setUsername] = useState(null)

  useEffect(() => {
    async function handleFetchUsername() {
      try {
        const response = await fetch("http://localhost:3000/get_username", {
          method: "GET",
          credentials: "include"
        })
        if (response.status === 200) {
          let data = await response.json()
          if (data) {
            setUsername(data.username)
          }
        }
      }
      catch (error) {
        alert("An error occurred. Please try again.")
      }
    }
    handleFetchUsername()
  }, [])

  return (
    <div>
      <Context.Provider value={{ username, setUsername }} >
      <Routes>
        <Route index element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<SignUp></SignUp>}></Route>
        <Route path='/mentor' element={<Mentor></Mentor>}></Route>
        <Route path='/chat' element={<Chat></Chat>}></Route>
        <Route path='/:name/profile' element={<Profile />}></Route>
        <Route path='/meeting' element={<Meeting></Meeting>}></Route>
      </Routes>
      </Context.Provider>
    </div>
  )
}

export default App

