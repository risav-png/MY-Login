const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const flash = require('connect-flash');
const session = require('express-session');

const app= express();

//DB configuration
const db = require('./config/keys').MongoURI;

//Connecting to Mongo
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log('MongoDb connected'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: true}));

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}));

//Connect Flash
app.use(flash());

//Globar Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});



//Routes handling
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    console.log(`Server is running on port ${PORT}`));