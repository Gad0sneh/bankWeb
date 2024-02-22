const User = require('../models/userModel');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")
const { default: mongoose } = require('mongoose');
const randormstring = require("randomstring");


const config = require("../config/config");


const securepassword = async(password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}


// for send mail
const sendVerifyMail = async(name, email, user_id) => {

    try{

    const transpoter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: "abubakargadanya5@gmail.com",
                pass: "Gadanya2005"
            },
            
        });

        
        const mailOptions = {
            from: config.emailUser ,
            to: email,
            subject: 'for verification mail',
            html: '<p>Hii '+ name +', please click here to <a href ="http://localhost:2882/verify?id='+ user_id +'"> verify </a> your mail.</p>'
        }

        const info = await transpoter.sendMail(mailOptions);
        console.log("Email has been sent:- ", info.response);

    } catch (error) {
        console.log("Email sending failed with: ", error.message);
    }

}


// const sendVerifyMail = async(name, email, user_id) => {

//     try{

//     const transpoter = nodemailer.createTransport(smtpTransport({
//             service: "Outlook365",
//             host: 'smtp.office365.com',
//             port: 587,
//             tls: {
//                 ciphers: "SSLv3",
//                 rejectUnauthorized: false,
//             },
//             auth:{
//                 user: "abubakargadanya5@gmail.com",
//                 pass: "Gadanya2005"
//             },
            
//         }));

        
//         const mailOptions = {
//             from: config.emailUser ,
//             to: email,
//             subject: 'for verification mail',
//             html: '<p>Hii '+ name +', please click here to <a href ="http://localhost:2882/verify?id='+ user_id +'"> verify </a> your mail.</p>'
//         }

//         const info = await transpoter.sendMail(mailOptions);
//         console.log("Email has been sent:- ", info.response);

//     } catch (error) {
//         console.log("Email sending failed with: ", error.message);
//     }

// }



//for reset password send mail

const sendResetPasswordMail = async(name, email, token) => {

    try{

    const transpoter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: config.emailUser,
                pass: config.emnailPassword
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            }
        });

        
        const mailOptions = {
            from: config.emailUser ,
            to: email,
            subject: 'for Reset password ',
            html: '<p>Hii '+ name +', please click here to <a href ="http://localhost:2882/forget-password?token='+token+'"> Reset </a> your password.</p>'
        }

        const info = await transpoter.sendMail(mailOptions);
        console.log("Email has been sent:- ", info.response);

    } catch (error) {
        console.log(error.message);
    }

}





const loadsignup = async(req, res) => {
    try{
        res.render('signup');
    } catch {
        console.log(err.message);
    }
}

const insertUser = async(req, res) => {

    try{

        const spassword = await securepassword( req.body.password);
        const user = new User({
            
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.phone,
            password: spassword,
            image: req.file.filename

        });

        const userData = await user.save();

        if( userData ){

            sendVerifyMail(req.body.name, req.body.email, userData._id  );
            res.render("login", {message: "your signup has been successful, please verify the email"});

        } else{

            res.render("signup", {message: "your signup failes"});

        }

    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({_id: req.query.id}, { $set: {is_verified:1 }})

        console.log(updateInfo);
        res.render("email-verified");

    } catch (error) {
        console.log(error.message)
    }
}

//login user 
const loginload = async (req, res ) => {
    try{
        res.render("login")

    } catch(error) {
        console.log(error.message)
    }
    
}

const verifylogin = async (req, res) => {

    try{

        const email = req.body.email;
        const password = req.body.password;
        
        const userData = await User.findOne({email: email});

        if(userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password);

            if(passwordMatch) {
                if(userData.is_verified === 0){
                    res.render("login", {message: "please verify yoyr email"});
                }

                else{
                    req.session.user_id = userData._id;
                    res.redirect("/timeline");
                }

            }
            else{
                res.render("login", {message: "Email or password is incorrect"})

            }
            

        } else {
            res.render("login", {message: "Email or password is incorrect"})
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loadHome = async (req, res) => {
    try{
        const userData = await User.findById({_id: req.session.user_id})
        res.render("timeline",{user: userData});

    } catch(error) {
        console.log(error.message)
    }
}

const loadProfile = async (req, res) => {
    try {
        const userProfile = await User.findById({_id: req.session.user_id})
        res.render("profile",{user: userProfile})
        
    } catch (error) {
        console.log(error.message)
    }
}

const userlogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/login");
        
    } catch (error) {
        console.log(error.message)
    }
}

//forget password

const forgetLoad = async(req, res) => {

    try {
        res.render("forgotten")
        
    } catch (error) {
        console.log(error.message);
    }

}

const forgetVerify = async(req, res) => {

    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if (userData) {
            if(userData.is_verified === 0) {
                res.render("forgotten", {message: "please verify your mail"})
            } 
            else{
                const randomstring = randormstring.generate();
                const updatedData = await User.updateOne({email:email}, {$set: {token:randomstring }});
                const userData = await User.findOne({email:email});
                sendResetPasswordMail(userData.name,userData.email,randomstring);
                res.render("forgotten", {message: "please check your mail to reset password"})
            }

        } else {
            res.render("forgotten", {message: "User email is incorrect "})
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports = {
    loadsignup,
    insertUser,
    verifyMail,
    sendVerifyMail,
    loginload,
    verifylogin,
    loadHome,
    userlogout,
    forgetLoad,
    forgetVerify,
    loadProfile
}

