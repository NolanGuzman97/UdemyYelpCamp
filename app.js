let express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"), 
    LocalStrategy = require("passport-local"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override')
    Campground = require('./models/campground'),
    User = require("./models/user"),
    data_populate = require('./seeds'),
    Comment = require("./models/comment"),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index"),
    flash = require("connect-flash");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelpcamp");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());

//data_populate();

app.use(require("express-session")({
    secret: "ThisIsASecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(8081);