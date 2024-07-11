import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUsernameExists } from '../utils/api';
import './Username.css';

const Username = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Retrieve stored username from local storage when the component mounts
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Check if the username exists in the database and navigate accordingly
    const checkUsername = async () => {
        try {
            const { exists, userID } = await checkUsernameExists(username);

            if (exists) {
                localStorage.setItem('username', username);
                localStorage.setItem('userID', userID);
                navigate('/user/test');
            } else {
                setMessage('Username not found. Please create a new one.');
            }
        } catch (error) {
            console.error('Error getting users:', error);
            setMessage('Failed to get users. Please try again.');
        }
    };

    // Navigate to the new user creation page
    const handleCreateUsername = () => {
        navigate('/newuser');
    };

    // Handle form submission to check the username
    const handleSubmit = (event) => {
        event.preventDefault();
        checkUsername();
    };

    // Handle changes to the username input field
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setMessage('');
    };

    return (
        <div className="login-container">
            <div className="innercontainer">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Enter your username"
                        />
                    </label>
                    <button type="submit" className="login-button">Login</button>
                    {message && <p>{message}</p>}
                </form>
                <p>
                    Don't have a username?{' '}
                    <button onClick={handleCreateUsername} className="create-button">Create one</button>
                </p>
            </div>
        </div>
    );
};

export default Username;
