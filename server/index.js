import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';
import { createConnection } from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import { catScores, repActScores } from './scores.js';

// for every line this is the username

const line_managers = {
    "erangon": "C",
    "nitayke": "P",
    "moshe": "M"
}

const app = express()

app.use(cors());
app.use(express.json());

let db;

function connectToDb() {
    db = createConnection({
        host: "my-sql",
        // host: "localhost",
        user: "root",
        password: "pass",
        database: "idanDB"
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL, Trying again...');
            // trying again after 4 seconds
            setTimeout(connectToDb, 4000);
        }
        else {
            console.log('Connected to MySQL');
        }
    });
}

connectToDb();

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
    const { username, email, password, firstName, lastName, role } = req.body;

    // checking if username exists in the db
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        if (err) {
            console.error(err)
            res.status(500).send({ message: 'Error checking username', reason: err });
        } else if (rows.length > 0) {
            res.status(409).send({ message: 'Username already exists' });
        } else {
            // if does not exist, encrypting password and saving to db
            bcrypt.hash(password, 10, (hashErr, hash) => {
                if (hashErr) {
                    console.log(hashErr);
                    res.status(500).send({ message: 'Error hashing password', reason: hashErr });
                } else {
                    db.query('INSERT INTO users (username, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
                        [username, email, hash, firstName, lastName, role], (insertErr, result) => {
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
            console.log(err);
            res.status(500).send({ message: 'Error logging in' });
        } else {
            if (results.length > 0) {
                // comparing 2 encrypted passwords - the one in the db
                // and the one that the client sent
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

// for line managers only - getting the list of researches
// which the makat of them is in his line
app.get("/line-researches/:username", (req, res) => {
    const username = req.params.username;
    if (!Object.keys(line_managers).includes(username)) {
        res.status(404).end();
        return;
    }
    db.query(`select * from researches r where r.makat in
        (select p.makat from products p where p.product_line =
         '${line_managers[username]}')`, (err, result) => {
        if (err) {
            res.status(500).end();
            return;
        }
        res.json(result);
    })
})

app.post("/price/:app", (req, res) => {
    const appId = req.params.app;
    const { price } = req.body;

    db.query("update applications set price = ? where id = ?", [price, appId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).end()
                return;
            }

            res.status(204).end()
        })
})

app.get("/researches-agg", (req, res) => {
    db.query(`select count(*) as r_count, count(conclusions) as closed_r_count,
         month(open_date), year(open_date) from researches
            group by month(open_date), year(open_date)`, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).end()
            return;
        }
        res.json(result);
    })
})


app.get("/applications-agg", (req, res) => {
    db.query(`select count(*) as a_count, count(is_success) as closed_a_count,
        sum(is_success) as success_count, sum(price) as price_sum, avg(price) as avg_price,
         month(open_date), year(open_date) from applications
            group by month(open_date), year(open_date)`, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).end()
            return;
        }
        res.json(result);
    })
})


app.get("/researches-ids", (req, res) => {
    db.query("select id from researches", (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).end()
            return
        }
        res.json(result)
    })
})

app.get("/products", (req, res) => {
    db.query("select distinct(makat) from products", (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send("Cannot find");
        }
        else {
            res.json(result.map(r => r.makat));
        }
    })
})

// update task when user finishes
app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;

    db.query(`update tasks set status = "done", conclusions = ? where id = ?`,
        [req.body.conclusions, id], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).end()
            }
            else {
                res.status(204).end()
            }
        })
})

// "my researches"
app.get("/researches/:username", (req, res) => {
    db.query("select * from researches where manager_username = ?",
        [req.params.username], (err, result) => {
            if (err) {
                res.status(500).end()
            }
            else {
                res.json(result)
            }
        })
})

// after the user writes a conclusion for a research
app.post("/conclusions/:research_name", (req, res) => {
    const research_name = req.params.research_name;
    const { conclusions } = req.body

    db.query("update researches set conclusions = ? where research_name = ?",
        [conclusions, research_name], (err, result) => {
            if (err) {
                res.status(500).end()
            }
            else {
                res.status(201).end()
            }
        })
})

// check the difference between 2 dates for 90 days
function diffDays(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return Math.floor((t2 - t1) / (24 * 3600 * 1000));
}

// get all applications (יישומי חקר) and logic for update
// the "is_success" field - check if 90 days passed and calculate the score
app.get("/applications", (req, res) => {
    db.query("select * from applications", (err, results) => {
        if (err) {
            res.status(500).end()
            return;
        }
        // select only the products from before 90 days
        db.query(`select * from products where
            open_date < DATE_SUB(NOW(), INTERVAL 90 DAY)`, (err, result) => {
            if (err) {
                res.status(500).end()
                return;
            }
            const dic = {}
            // calculate the scores for each makat before 90 days
            result.forEach(val => {
                const s = (catScores[val.cat] || 0) + (repActScores[val.rep_act] || 0);
                if (dic[val.makat]) {
                    dic[val.makat] += s;
                }
                else {
                    dic[val.makat] = s;
                }
            })

            // selecting all the products
            db.query("select * from products", (err1, result1) => {
                if (err1) {
                    res.status(500).end()
                    return;
                }

                const dic1 = {}
                // calculate the current score
                result1.forEach(val => {
                    const s = (catScores[val.cat] || 0) + (repActScores[val.rep_act] || 0);
                    if (dic1[val.makat]) {
                        dic1[val.makat] += s;
                    }
                    else {
                        dic1[val.makat] = s;
                    }
                })

                res.json(results.map(r => {
                    // if 90 days are over - add "is_success" field
                    const diff = diffDays(new Date(r.open_date), new Date())
                    if (diff > 90 || diff < -90) {
                        const is_success = (dic[r.makat] / dic1[r.makat]) > 1.3
                        return { ...r, is_success }
                    }
                    return r;
                }))
            })
        })
    })
})

// add research application
app.post("/applications", (req, res) => {
    db.query("insert into applications set ?", {
        ...req.body,
        open_date: new Date().toJSON().slice(0, 19).replace("T", " ")
    }, (err, result, fields) => {
        if (err) {
            console.error(err);
            res.status(500).end()
            return;
        }

        res.status(201).end()
    })
})

// add research
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

        res.status(201).json(result.insertId)
    })
})

// add multiple tasks - all the "values" are inserted in one command
app.post("/tasks", (req, res) => {
    const values = [];
    Object.keys(req.body).forEach(key => {
        req.body[key].forEach(task => {
            values.push([key, task.task_name, task.research_name,
                task.dest_date.slice(0, 19).replace("T", " "), "opened"]);
        });
    })
    db.query("insert into tasks (username, task_name, research_name," +
        " dest_date, status) values ?", [values],
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

// "my tasks"
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

// check if a makat is problematic
app.get("/bad-product/:makat", (req, res) => {
    const makat = req.params.makat;

    db.query("select * from products", (err, result) => {
        if (!result.find(val => val.makat === makat)) {
            res.send("הרכיב לא קיים במערכת")
            return;
        }

        const dic = {}

        // calculating the score for each makat
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
        // sorting the scores
        entries.sort((a, b) => b[1] - a[1]);

        // if the makat is in top 3% scores - it is problematic
        const percentileIndex = Math.ceil(entries.length * 0.03);
        // get the score of the makat
        const makatScore = entries.find(entry => entry[0] === makat)?.[1];
        // get the score of the minimal problematic score
        const minimalProblemScore = entries[percentileIndex - 1]?.[1];

        if (makatScore >= minimalProblemScore)
            res.send("הרכיב בעייתי");
        else
            res.send("הרכיב אינו בעייתי");
    })
})

// "my applications"
app.get("/application/:username", (req, res) => {
    const username = req.params.username;

    if (!Object.keys(line_managers).includes(username)) {
        res.json([])
    }

    db.query(`select * from researches r where r.makat in
        (select p.makat from products p where p.product_line =
         '${line_managers[username]}') and r.conclusions is not null`, (err, results) => {
        if (err) res.status(500).end()
        else {
            res.json(results)
        }
    })
})

const PORT = 3040

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});