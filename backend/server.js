const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/questions', express.static(path.join(__dirname, 'questions_converted')));

const db = new Database('my-database.db');
db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, correct INTEGER, incorrect INTEGER)').run();

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

app.get('/users', (req, res) => {
    try {
        const { username } = req.query;
        const stmt = db.prepare('SELECT id, name FROM users WHERE name = ?');
        const user = stmt.get(username);
        console.log(user, username)
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Failed to get user');
    }
});


app.put('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { correct } = req.body;

        const columnToUpdate = correct ? 'correct' : 'incorrect';
        const stmt = db.prepare(`UPDATE users SET ${columnToUpdate} = ${columnToUpdate} + 1 WHERE id = ?`);
        const info = stmt.run(id);

        res.send(`Updated ${info.changes} row(s)`);
        getScore();


    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Failed to update user');
    }
});



const getScore = () => {
    app.post('/users/score/:id', (req, res) => {
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
    });

}

app.get('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const user = stmt.get(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Failed to get user');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
