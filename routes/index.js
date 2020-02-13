let express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get('/', (req,res) =>{
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register", {page: 'register'});
});

router.post("/register", (req, res) => {
    if(req.body.adminCode === req.app.locals.adminCode){
        req.body.isAdmin = true;
    }
    User.register(new User({username: req.body.username, isAdmin: req.body.isAdmin}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`)
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) =>{
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You've been logged out.");
    res.redirect("/campgrounds");
})

module.exports = router;