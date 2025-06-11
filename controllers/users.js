const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.createNewUser = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");

            const redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    })
}