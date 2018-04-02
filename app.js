var express = require("express");
            

var app = express();
// looks in the current directory where app.js lives ('./')
var indexRoutes = require("./routes/index")


// tells express that the templates are all ejs so you don't have to add .ejs to all templates
app.set("view engine", "ejs");
// below is required so express knows where to go for all CSS related styling sheet files and other static files
// NOTE: Need to look into .use() morels
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("landing")
})

// this tells express to use variable INDEXROUTES whenever the url "/" is pinged, therefore every route
// within the index.js file has "/" appended to it
app.use("/", indexRoutes)

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The project site server Has Started!");
});