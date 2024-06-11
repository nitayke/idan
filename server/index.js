import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';
import { createConnection } from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import { catScores, repActScores } from './scores.js';

const app = express()

app.use(cors());
app.use(express.json());

const PORT = 3040;
const db = createConnection({
    host: process.env.HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('Connected to MySQL');
});


app.get("/users", (req, res) => {
    const query = "SELECT id, username, first_name, last_name FROM users";

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
            return;
        }

        res.json(result);
    })
})

app.post('/signup', (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        if (err) {
            res.status(500).send({ message: 'Error checking username', reason: err });
        } else if (rows.length > 0) {
            res.status(409).send({ message: 'Username already exists' });
        } else {
            bcrypt.hash(password, 10, (hashErr, hash) => {
                if (hashErr) {
                    console.log(hashErr);
                    res.status(500).send({ message: 'Error hashing password', reason: hashErr });
                } else {
                    db.query('INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
                        [username, email, hash, firstName, lastName], (insertErr, result) => {
                            if (insertErr) {
                                res.status(500).send({ message: 'Error registering user', reason: insertErr });
                            } else {
                                res.status(201).send({ message: 'User registered successfully' });
                            }
                        });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error logging in' });
        } else {
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err || !isMatch) {
                        res.status(401).end();
                    } else {
                        res.status(200).end();
                    }
                });
            } else {
                res.status(401).end();
            }
        }
    });
});

app.get("/products", (req, res) => {
    db.query("select distinct(makat) from products", (err, result) => {
        if (err) {
            res.status(500).send("Cannot find");
        }
        else {
            res.json(result.map(r => r.makat));
        }
    })
})

app.post("/researches", (req, res) => {
    db.query("insert into researches set ?", {
        ...req.body,
        users: req.body.users.map(u => u.username).join(",")
    }, (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).end();
            return
        }

        res.status(201).end()
    })
})

app.post("/tasks", (req, res) => {
    const values = [];
    Object.keys(req.body).forEach(key => {
        req.body[key].forEach(task => {
            values.push([key, task, "opened"]);
        });
    })
    db.query("insert into tasks (username, research_name, status) values ?", [values],
        (err) => {
            if (err) {
                console.log(err)
                res.status(500).end()
            }
            else {
                res.status(201).end()
            }
        }
    )
})

app.get("/tasks/:username", (req, res) => {
    const username = req.params.username

    db.query("select * from tasks where username = ?", [username], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).end()
        }
        else {
            res.json(result);
        }
    })
})

app.get("/bad-product/:makat", (req, res) => {
    const makat = req.params.makat;

    db.query("select * from products", (err, result) => {
        if (!result.find(val => val.makat === makat)) {
            res.send("הרכיב לא קיים במערכת")
            return;
        }

        const dic = {}

        result.forEach(val => {
            const s = (catScores[val.cat] || 0) + (repActScores[val.rep_act] || 0);
            if (dic[val.makat]) {
                dic[val.makat] += s;
            }
            else {
                dic[val.makat] = s;
            }
        })

        const entries = Object.entries(dic);
        entries.sort((a, b) => b[1] - a[1]);

        const percentileIndex = Math.ceil(entries.length * 0.03);
        const valueForId = entries.find(entry => entry[0] === makat)?.[1];
        const top1PercentValue = entries[percentileIndex - 1]?.[1];

        if (valueForId >= top1PercentValue)
            res.send("הרכיב בעייתי");
        else
            res.send("הרכיב אינו בעייתי");
    })
})

app.get("/", (req, res) => {
    res.send("alright")
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});