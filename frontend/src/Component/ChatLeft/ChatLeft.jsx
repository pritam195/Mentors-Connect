import React, { useState, useEffect } from 'react';
import './ChatLeft.css';
import profileimage from '../../assets/profileimage.jpg';
import search from '../../assets/search.png';

const ChatLeft = ({ users, selectedUser, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    return (
        <div className="chatleft">
            <div className="search-bar">
                <img src={search} alt="search icon" />
                <input
                    type="text"
                    placeholder="Search here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="mentees-container">
                {filteredUsers.map(user => (
                    <div
                        key={user.username}
                        className={`person1${selectedUser.username === user.username ? ' selected' : ''}`}
                        onClick={() => onSelectUser(user)}
                        style={{
                            cursor: 'pointer',
                            background: selectedUser.username === user.username ? '#e6f7ff' : ''
                        }}
                    >
                        <img src={profileimage} alt="" />
                        <h2>{user.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatLeft;
