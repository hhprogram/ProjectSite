var express = require("express")
var router = express.Router()

// note: I don't have to put "/Blog" in front of each of these URLs. because 
// in my app.js file. I have told Express that everything in this file
// should have the path /Blog prepended to it

router.get("/", function(req, res){
    // note: that I don't have to put .. in the path in the 'render' argument because by default express prepends 'views' directory for all template paths
    res.render("Blog/home")
});

module.exports = router