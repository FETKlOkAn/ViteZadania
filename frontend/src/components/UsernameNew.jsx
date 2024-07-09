import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUsernameExists } from '../utils/api';
import './UsernameNew.css';
import axios from 'axios';

const UsernameNew = () => {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle changes to the new username input field
    const handleNewUsernameChange = (event) => {
        setNewUsername(event.target.value);
        setMessage('');
    };

    // Handle the creation of a new username
    const handleCreateNewUsername = async (event) => {
        event.preventDefault();

        try {
            // Check if the username already exists
            const usernameExists = await checkUsernameExists(newUsername);

            if (usernameExists) {
                setMessage('Username already exists. Please choose another one.');
                return;
            }

            // If username doesn't exist, send a request to create it
            const url = 'http://localhost:5000/newuser';
            const data = { name: newUsername };

            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Process the response to extract userID and store it in local storage
            const result = response.data;
            const userID = result.split(': ')[1];
            localStorage.setItem('userID', userID);
            setMessage(result);

            // Navigate to the login page after a brief delay
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Error creating username:', error);
            setMessage('Failed to create username. Please try again.');
        }
    };

    return (
        <div className="create-username-container">
            <div className='inner'>
                <h2>Create New Username</h2>
                <form onSubmit={handleCreateNewUsername}>
                    <label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={handleNewUsernameChange}
                            className="username-input"
                            placeholder="new username"
                        />
                    </label>
                    <button type="submit" className="create-username-button">Create Username</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default UsernameNew;
