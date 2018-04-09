var express = require("express");
var router = express.Router();

// note: I don't have to put "/WhaleGame" in front of each of these URLs. because 
// in my app.js file. I have told Express that everything in this file
// should have the path /WhaleGame prepended to it

router.get("/", function(req, res) {
    // note: that I don't have to put .. in the path in the 'render' argument because by default express prepends 'views' directory for all template paths
    res.render("Whale/home")
});

// route to retrieve the data that the python test script returns
router.get("/testPython", connectToPython);

// function that is called when we hit the route above
function connectToPython(req, res) {
    var inputs = []
    amqb.connect('amqb://localhost', function(err, conn) {
    conn.createChannel(function(err, channel) {
        channel.assertQueue(q=resultsQueue, {Durable:true});
        console.log("Waiting for messages in the %s queue", resultsQueue)
        channel.consume(q, 
                        function(msg) {
                            console.log("Received %s in %s queue", msg.content.toString(), resultsQueue) 
                        }, 
                        noAck=false); 
        });
    });
});

// note: need to remember to do this or else will get an error. For eaxxmple the use()
// function in app.js that uses this file will throw an error
module.exports = router