const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Validation
const validateRegisterInput = require('./../../validation/register')
const validateLoginInput = require('./../../validation/login')
// Model
const User = require('../../models/User')

//@route   POST api/users/register
//@desc    Register a user
//@access  Public              
router.post('/register', (req, res) => {
    // Check Validation
    const { errors, isValid } = validateRegisterInput(req.body)
    if(!isValid) return res.status(400).json(errors)

    // Check if email exists, Register user details
    User.findOne({ email: email.req.body.email })
        .then(user => {
            if(user) {
                errors.email = 'Email already in use'
                return res.status(400).json({ errors })
            }
            else {
                const newUser = new User({
                    name: req.body.name,
                    school: req.body.school,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })

})

//@route   POST api/users/login
//@desc    Login to account
//@access  Public    
router.post('/login', (req, res) => {
    //Check Validation
    const { errors, isValid } = validateLoginInput(req.body)
    if(!isValid) return res.status(400).json(errors)

    const email = req.body.email
    const password = req.body.password

    // Find a user by email
    User.findOne({ email }).then(user => {
        //Check for user
        if(!user) {
            errors.email = 'User not found'
            return res.status(404).json(errors)
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            //Password matches
            if(isMatch) {
                // Create JWT payload
                const payload = { 
                    id: user.id, 
                    name: user.name
                }

                //Sign Token
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            } 
            // Wrong Password
            else {
                errors.password = 'Password incorrect'
                return res.status(400).json(errors)
            }
        })
    })
})

module.exports = router