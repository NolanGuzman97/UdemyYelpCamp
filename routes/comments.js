let express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

router.get("/:comm_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comm_id, (err, comment) => {
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id:req.params.id, comment:comment})
        }
    })
})

router.put("/:comm_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comm_id, req.body.comment, (err, campground) => {
        if(err){
            res.redirect("back");
        } else{
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})

router.delete("/:comm_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comm_id, (err) => {
        if(err){
            res.redirect("back");
        } else{
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comm_id, (err, comment) => {
            if(err){
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back"); 
                }
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = router;