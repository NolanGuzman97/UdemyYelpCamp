var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var Campground = require('./models/campground')
var data_populate = require('./seeds');
var Comment = require("./models/comment")

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelpcamp");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`))

data_populate();

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

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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
})

app.listen(8081);