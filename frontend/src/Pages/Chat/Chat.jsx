import React, { useState, useEffect } from 'react';
import ChatLeft from '../../Component/ChatLeft/ChatLeft';
import ChatRight from '../../Component/ChatRight/ChatRight';
import Navbar from '../../Component/Navbar/Navbar';
import axios from 'axios';
import socket from '../../socket';
import './Chat.css';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageTimes, setMessageTimes] = useState({}); // 🕒 username: timestamp

  const loggedInUserId = localStorage.getItem("loggedInUsername");

  // 🔹 Load all users initially
  useEffect(() => {
    axios.get('https://mentors-connect-zh64.onrender.com/users')
      .then(res => {
        // 🔥 Filter out logged-in user
        const filteredUsers = res.data.filter(user => user.username !== loggedInUserId);
        setUsers(filteredUsers);
        setSelectedUser(filteredUsers[0]); // Select first other user
      })
      .catch(err => console.error(err));
  }, []);
  

  // 🔹 Load messages related to selected user
  useEffect(() => {
    if (!selectedUser) return;

    axios.get(`https://mentors-connect-zh64.onrender.com/messages/${loggedInUserId}`)
      .then(res => {
        const filtered = res.data.filter(
          m =>
            m.senderId === selectedUser.username ||
            m.receiverId === selectedUser.username
        );
        setMessages(filtered);
        updateMessageTime(selectedUser.username, filtered.at(-1)?.timestamp); // ⬅️ latest time
      })
      .catch(err => console.error(err));
  }, [selectedUser]);

  // 🔹 Real-time message handling
  useEffect(() => {
    const handleIncoming = (msg) => {
      const isBetween = [msg.senderId, msg.receiverId].includes(loggedInUserId);

      if (isBetween) {
        const chatPartner = msg.senderId === loggedInUserId ? msg.receiverId : msg.senderId;

        // Update latest message time
        updateMessageTime(chatPartner, msg.timestamp);

        // If message belongs to selected user chat, show it
        if (chatPartner === selectedUser?.username) {
          setMessages(prev => [...prev, msg]);
        }
      }
    };

    socket.on('receive_message', handleIncoming);
    return () => socket.off('receive_message', handleIncoming);
  }, [selectedUser]);

  // 🔁 Helper to update message time + sort
  const updateMessageTime = (username, timestamp) => {
    if (!timestamp) return;
    setMessageTimes(prev => {
      const updated = { ...prev, [username]: timestamp };
      sortUsersByMessageTime(updated);
      return updated;
    });
  };

  const sortUsersByMessageTime = (msgTimeMap) => {
    setUsers(prev => {
      return [...prev].sort((a, b) => {
        const aTime = new Date(msgTimeMap[a.username] || 0);
        const bTime = new Date(msgTimeMap[b.username] || 0);
        return bTime - aTime;
      });
    });
  };

  const handleSend = (text) => {
    const timestamp = new Date().toISOString();

    const message = {
      senderId: loggedInUserId,
      receiverId: selectedUser.username,
      text,
      timestamp, // include timestamp for all clients
    };

    // Emit via socket (will save in backend and broadcast)
    socket.emit('send_message', message);

    // Optimistically update UI
    setMessages(prev => [...prev, { ...message, sender: 'You' }]);

    // Update user list sort (optional helper)
    updateMessageTime(selectedUser.username, timestamp);
  };
  

  return (
    <>
      <Navbar />
      <div className="chat-wrapper">
        <div className="chat-container">
          <ChatLeft
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
          {selectedUser && (
            <ChatRight
              user={selectedUser}
              messages={messages.map(m => ({
                text: m.text,
                sender: m.senderId === loggedInUserId ? 'You' : selectedUser.name
              }))}
              onSend={handleSend}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
