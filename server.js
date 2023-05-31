const express = require('express')
const mongoose = require('mongoose')
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Wassup World!')
})

const bcrypt = require("bcrypt");
const User = require('./models/user_signin')
app.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

app.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        userId: user[0]._id,
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

const Resume = require('./models/resume_model');

// Create a new resume
app.post('/resumes', (req, res) => {
    const { userId, personalInfo, education, skills } = req.body;

    const resume = new Resume({
        userId,
        personalInfo,
        education,
        skills
    });

    resume.save()
        .then(savedResume => {
            res.status(201).json(savedResume);
        })
        .catch(error => {
            console.error('Error saving resume:', error);
            res.status(500).json({ error: 'Failed to create resume ' + error });
        });
});




mongoose.connect("mongodb+srv://ilyaskukshi:ilyaskukshi@cluster0.bn4aw.mongodb.net/Video-Editors?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected")
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }).catch((error) => {
        console.log(error)
    })