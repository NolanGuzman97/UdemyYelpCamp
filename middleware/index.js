let middlewareObj = {},
    Campground = require("../models/campground")
    Comment = require("../models/comment")

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, campground) => {
            if(err || !campground){
                req.flash("error", "Campground not found, please contact tech support");
                res.redirect("back");
            } else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to access this page")
                    res.redirect("back"); 
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to access this feature")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comm_id, (err, comment) => {
            if(err|| !comment){
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You do not have permission to use this feature")
                    res.redirect("back"); 
                }
            }
         });
    } else{
        req.flash("error", "You do not have permission.")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You must be logged in to use this feature")
        res.redirect("/login");
    }
}

module.exports = middlewareObj