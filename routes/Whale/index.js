var express = require("express");
var router = express.Router();

// note: I don't have to put "/WhaleGame" in front of each of these URLs. because 
// in my app.js file. I have told Express that everything in this file
// should have the path /WhaleGame prepended to it

router.get("/", function(req, res) {
    // note: that I don't have to put .. in the path in the 'render' argument because by default express prepends 'views' directory for all template paths
    res.render("Whale/home")
});

// note: need to remember to do this or else will get an error. For eaxxmple the use()
// function in app.js that uses this file will throw an error
module.exports = router