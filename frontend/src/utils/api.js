// utils/api.js
import axios from 'axios';

export const checkUsernameExists = async (username) => {
    try {
        const url = `http://localhost:5000/users/${encodeURIComponent(username)}`;
        const response = await axios.get(url);

        return response.data; // returns { exists: true/false, userID: id } object
    } catch (error) {
        console.error('Error checking username existence:', error);
        throw new Error('Failed to check username existence');
    }
};
