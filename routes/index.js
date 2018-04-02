var express = require("express");
var router = express.Router();
var passport = express("passport");


// login route (second argument is the callback once we handle the url /login)
router.get("/login", function(req, res) {
    // note: that I don't have to put any path in the 'render' argument because by default express looks at the 'views' directory for all templates
    res.render("login");
})

router.get("/", function(req, res) {
    res.render("landing")
})

// module is an node object that encompasses this file (ie module) and then .exports is the return value of this module
// when other files do require()
module.exports = router;