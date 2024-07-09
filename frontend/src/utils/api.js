// Check if a username exists in the database
export const checkUsernameExists = async (username) => {
    try {
        const url = `http://localhost:5000/users?username=${encodeURIComponent(username)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // Username not found
            }
            throw new Error('Failed to get data from database');
        }

        const user = await response.json();
        console.log('Fetched user:', user);

        if (user && user.name === username) {
            console.log('User ID:', user.id);
            return user.id; // Return user ID if username matches
        } else {
            return null; // Username not found
        }
    } catch (error) {
        console.error('Error checking username:', error);
        throw new Error('Failed to check username');
    }
};
