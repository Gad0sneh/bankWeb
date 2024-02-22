const express = require("express");
const user_route = express();
const session = require("express-session")

user_route.set("view engine", "ejs");

const auth = require("../middleware/auth");

const config = require("../config/config");


const bodyparser = require("body-parser");
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended: true}))
user_route.use(express.static("userImages"));

user_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

const multer = require("multer")
const path = require("path");

const storage = multer.diskStorage({
    // destination: function( req, file, cb) {
    //     cb(null, path.join(__dirname, "../public/userImages"));
    // },
    // filename: function(req, file, cb){
    //     const name = Date.now()+'-'+file.originalname;
    //     cb(null, name);
    // },

    destination: (req, file, cb) => {
        cb(null, "userImages")  
    },

    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

const userController = require("../controllers/userController");

user_route.get("/signup", auth.isLogout, userController.loadsignup);
user_route.get('/verify', userController.verifyMail);
user_route.get("/login", auth.isLogout, userController.loginload);
user_route.get("/timeline", auth.isLogin, userController.loadHome);
user_route.get("/profile", auth.isLogin, userController.loadProfile);


user_route.post("/login", userController.verifylogin);
user_route.post("/signup", upload.single("image"), userController.insertUser)

user_route.get("/logout", auth.isLogin,userController.userlogout);

user_route.get("/forgotten",auth.isLogout, userController.forgetLoad);
user_route.post("/forgotten",userController.forgetVerify);


user_route.get("/", (req, res) => { 
    res.render("index");
})

user_route.get("/FP", (req, res) => {
    res.render("FP");
})

user_route.get("/VC", (req, res) => {

    res.render("VC");
})

user_route.get("/pin", (req, res) => {
    res.render("pin");
})


user_route.get("/transfer", (req, res) => {
    res.render("transfer");
})

user_route.get("/other", (req, res) => {
    res.render("other");
})

user_route.get("/withdraw", (req, res) => {
    res.render("withdraw");
})

user_route.get("/data", (req, res) => {
    res.render("data");
})

user_route.get("/daily", (req, res) => {
    res.render("daily");
})

user_route.get("/weekly", (req, res) => {
    res.render("weekly");
})

user_route.get("/monthly", (req, res) => {
    res.render("monthly");
})

user_route.get("/airtime", (req, res) => {
    res.render("airtime");
})

user_route.get("/limit", (req, res) => {
    res.render("limit");
})

user_route.get("/bankcard", (req, res) => {
    res.render("bankcard");
})

user_route.get("/bankaccount", (req, res) => {
    res.render("bankaccount");
});

user_route.get("/setting", (req, res) => {
    res.render("setting");
});

user_route.get("/loginsettings", (req, res) => {
    res.render("loginsettings");
});

user_route.get("/payment", (req, res) => {
    res.render("payment");
});

user_route.get("/about", (req, res) => {
    res.render("about");
});

user_route.get("/enterpin-2", (req, res) => {
    res.render("enterpin-2");
});

user_route.get("/changepin", (req, res) => {
    res.render("changepin");
});

user_route.get("/successful", (req, res) => {
    res.render("successful");
});

user_route.get("/successful-2", (req, res) => {
    res.render("successful-2");
});

user_route.get("/forgotpin", (req, res) => {
    res.render("forgotpin");
});

user_route.get("/paycard", (req, res) => {
    res.render("paycard");
});

user_route.get("/enterpin-3", (req, res) => {
    res.render("enterpin-3");
});

user_route.get("/physicalcard", (req, res) => {
    res.render("physicalcard");
});

user_route.get("/transfer-1", (req, res) => {
    res.render("transfer-1");
});

module.exports = user_route;