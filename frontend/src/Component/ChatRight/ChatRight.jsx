import React, { useState, useRef, useEffect } from 'react'
import './ChatRight.css'

const ChatRight = ({ user, messages, onSend }) => {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, user])

    const handleSend = () => {
        if (input.trim() === '') return
        onSend(input)
        setInput('')
    }

    return (
        <div className="chatright">
            <div className="chat-header">{user.name}</div>

            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message ${msg.sender === 'You' ? 'user' : 'other'}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>

    )
}

export default ChatRight