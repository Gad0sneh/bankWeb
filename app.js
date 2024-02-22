const express        = require("express");
const app            = express();
const port           = 2705;
const mongoose       = require("mongoose");



app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bankDB");
mongoose.set('strictQuery', true);


// for user routes
const userRoute = require("./routes/userRoute")
app.use(userRoute)





//login using hashing

// app.post("/login", (req, res) => {


//     const email = req.body.email
//     const password = md5( req.body.password)

//     User.findOne({email: email, password: password}, (err, foundUser) => {

//         if(err){
//             console.log(err);
//         } else{
//             if(foundUser){
//                 if(foundUser.password === password){
//                     res.redirect("timeline");
//                     console.log("foundUser")
//                 }
//             }
//         }
//     });
// });


//signup hashing

// app.post("/signup", (req, res,) =>{
//     const newUser =  new User({
//         email: req.body.email,
//         name: req.body.name,
//         password: req.body.password
//     });


    // newUser.save((err) => {
    //     if(err){
    //         console.log(err)
    //     } else{
    //         res.render("login")
    //         console.log("USER saved successful")
    //     }
//     })
// })





app.listen(port, () => {
    console.log("My node.js app is running at http://localhost:${port:2705}");
});

