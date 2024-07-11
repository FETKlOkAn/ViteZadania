const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const app = express();
const port = 5000;

//middleware functions
app.use(cors());
app.use(express.json());

//creatinting a new database using better-sqlite3
const db = new Database('my-database.db');
db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, correct INTEGER, incorrect INTEGER)').run();


//post endpoint for /newuser to handle newuser creation
app.post('/newuser', (req, res, next) => {
    try {
        const { name, correct = 0, incorrect = 0 } = req.body;
        if (!name) {
            throw new Error('Name is required');
        }
        const stmt = db.prepare('INSERT INTO users (name, correct, incorrect) VALUES (?, ?, ?)');
        const info = stmt.run(name, correct, incorrect);
        res.send(`User created with ID: ${info.lastInsertRowid}`);
    } catch (error) {
        next(error);
    }
});

//put endpoint for updating correct or incorrect column in database
app.put('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { correct } = req.body;

        const columnToUpdate = correct ? 'correct' : 'incorrect';
        const stmt = db.prepare(`UPDATE users SET ${columnToUpdate} = ${columnToUpdate} + 1 WHERE id = ?`);
        const info = stmt.run(id);

        res.send(`Updated ${info.changes} row(s)`);

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Failed to update user');
    }
});


// Define getScore as a standalone function outside any other function
const getScore = (req, res) => {
    try {
        const { id } = req.params;
        const { correct } = req.body;

        const stmt = db.prepare(`SELECT ${correct ? 'correct' : 'incorrect'} FROM users WHERE id = ?`);
        const info = stmt.get(id);
        if (info) {
            console.log(info.correct);
            correct ? res.json({ correct: info.correct }) : res.json({ incorrect: info.incorrect });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch user');
    }
};

// Use getScore as the handler for the POST request
app.post('/users/score/:id', getScore);


// GET endpoint to check if a username exists and retrieve userID
app.get('/users/:username', (req, res) => {
    try {
        const { username } = req.params;
        const stmt = db.prepare('SELECT id FROM users WHERE name = ?');
        const user = stmt.get(username);

        if (user) {
            res.json({ exists: true, userID: user.id });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking username existence:', error);
        res.status(500).send('Failed to check username existence');
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
