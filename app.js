let express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"), 
    LocalStrategy = require("passport-local"),
    bodyParser = require('body-parser'),
    Campground = require('./models/campground'),
    User = require("./models/user"),
    data_populate = require('./seeds'),
    Comment = require("./models/comment")

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelpcamp");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

data_populate();

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
    next();
});

app.get('/', (req,res) =>{
    res.render("landing");
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: campgrounds});  
        }
    })
});

app.post('/campgrounds', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image:image, description:description};
    Campground.create(newCampground, (err, newEntry) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds')
        }
    })
    
});

app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new")
});

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

app.listen(8081);