const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')

const app = express()

//Body parser MW
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//PassportJS MW
app.use(passport.initialize())
require('./config/passport')(passport)

//Config mongo
const db = require('./config/keys').mongoURI
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err))

//Routes
app.use('/api/users', users)
//app.use(/*profile*/)
//app.use(/*post*/)

const port = process.env.port || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))