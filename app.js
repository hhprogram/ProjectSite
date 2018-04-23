var express = require("express");
            

var app = express();
// looks in the current directory where app.js lives ('./') - which is the "ProjectSite" directory 
// and then looks in the 'routes' directory
// also note that we don't have to notify specifically to require /routes/index.js because by 
// default express will automatically find and required the index.js file within the 'routes' directory
// if specific file not given
var indexRoutes = require("./routes")
var whaleRoutes = require("./routes/Whale")
var patatapRoutes = require("./routes/Patatap")
var blogRoutes = require("./routes/Blog")
var pythonRoutes = require("./routes/PythonTest")

// tells express that the templates are all ejs so you don't have to add .ejs to all templates
app.set("view engine", "ejs");
// below is required so express knows where to go for all CSS related styling sheet files and other static files
// NOTE: Need to look into .use() morels
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("landing")
})

// this tells express to use variable INDEXROUTES whenever the url "/" is pinged, therefore every route
// within the index.js file has "/" prepended to it
app.use("/", indexRoutes)
// this tells express to use variable INDEXROUTES whenever the url "/" is pinged, therefore every route
// within the index.js file has "/WhaleGame" prepended to it
app.use("/WhaleGame", whaleRoutes)
app.use("/Blog", blogRoutes)
app.use("/Patatap", patatapRoutes)
app.use("/PythonTest", pythonRoutes)

// NOTE: changed for the locally run version of the app. Put in the port and took out the IP argument as 
// no longer need as if left blank just runs in localhost
port = 3000
app.listen(port, function(){
   console.log("The project site server Has Started! It's on port " + port);
});