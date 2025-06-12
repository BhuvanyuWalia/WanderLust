if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
//--------- Express and Mongoose -----------------------------
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbURL = process.env.ATLASDB_URL;
//--------- EJS ----------------------------------------------
const path = require('path');
const engine = require('ejs-mate');
app.engine('ejs',engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
//--------- Method Override ----------------------------------
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
//------- Error Handling -------------------------------------

//------- Schemas and Models ---------------------------------
const User = require("./models/user.js");
//------- Session and Flash ----------------------------------
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
//------- Static Files ---------------------------------------
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
//------- Routers --------------------------------------------
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
// --------------- FLASH ---------------------------
const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600
});
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}
app.use(session(sessionOptions));
app.use(flash());
//------- Passport -------------------------------------------
const passport = require('passport');
const LocalStrategy = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(()=>{
        console.log("connected to DB WanderLust");
    })
    .catch((err)=>{
        console.log("Error connecting to DB WanderLust");
    });
async function main(){
    await mongoose.connect(dbURL);
}

// root route --------------------------------------
app.get('/',(req,res)=>{
    res.redirect("/listings");
});

// flash and session messages ----------------------
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ---------- ROUTERS -------------------------------
app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings', listingRouter);
app.use('/', userRouter);

app.use((err,req,res,next)=>{
    let {statusCode=500, message="some error occurred"} = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
app.listen(8080, ()=>{
    console.log("Server is listening on port 8080");
});