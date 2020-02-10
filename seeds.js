var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var Campground = require('./models/campground');
var Comment   = require("./models/comment");
 
var seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://cdn.pixabay.com/photo/2017/05/05/16/06/teepees-2287571_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
async function seedDB(){
   //Remove all campgrounds
   await Campground.deleteMany({});
   console.log("Campground Deletion Success")
   await Comment.deleteMany({});
   console.log("Comment Deletion Success")

   for(const seed of seeds){
        let campground = await(Campground.create(seed));
        console.log("New Campground Created")
        let comment = await Comment.create(
            {
            text: "This place is great, but I wish there was internet",
            author: "Homer"
            });
        console.log("New Comment Created")
        campground.comments.push(comment);
        campground.save();
        console.log("Comment Successfully added to Campground")
    } 
}
 
module.exports = seedDB;