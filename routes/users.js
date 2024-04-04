const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');

router.get('/login',(req,res)=>{
    res.render('login');
});

//Registration page
router.get('/register',(req,res)=>{
    res.render('register');
});

//Register Handler
router.post('/register',(req,res)=>{
    const {name, email, password,password2} = req.body;
    let errors = [];

    //check for fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Enter all the information'});
    }

    //check if both password is true
    if(password != password2){
        errors.push({msg:'Password not matching with confirm password'});
    }

    //Check the length of password
    if(password.length < 8){
        errors.push({msg: 'Password should be of at least 8 character'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2

        });
    } else{
       //Validation passed
       User.findOne({email: email})
        .then(user=> {
            if(user){
            errors.push({msg:'Email already exist'});
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        }else {
            const newUser = new User({
                name,
                email,
                password
            });
            //Hashing password
            bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                //set password to hashed
                newUser.password =hash;
                //save User
                newUser.save()
                .then(user =>{
                    req.flash('success_msg','You are now registered');
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
            }))
           

        }
        });


    }
});

module.exports = router;