let express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "An error occurred, contact tech support");
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "You're comment has been added!")
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

router.get("/:comm_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err || !campground){
            req.flash("error", "Campground is Not Associated with this comment")
            return res.redirect("back");
        }
        Comment.findById(req.params.comm_id, (err, comment) => {
            if(err){
                res.redirect("back");
            } else{
                res.render("comments/edit", {campground_id:req.params.id, comment:comment})
            }
        });
    });
});

router.put("/:comm_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comm_id, req.body.comment, (err, campground) => {
        if(err){
            res.redirect("back");
        } else{
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})

router.delete("/:comm_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comm_id, (err) => {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Your comment has been deleted!")
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });
})

module.exports = router;