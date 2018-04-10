var express = require("express")
var router = express.Router()
var amqb = require("amqplib/callback_api");

// see: http://www.rabbitmq.com/tutorials/tutorial-two-python.html

var resultsQueue = "results";

// note: I don't have to put "/PythonTest" in front of each of these URLs. because 
// in my app.js file. I have told Express that everything in this file
// should have the path /PythonTest prepended to it
// handler - the landing page for this route will just be the input form as well
router.get("/", function(req, res) {
    // note: that I don't have to put .. in the path in the 'render' argument because by default express prepends 'views' directory for all template paths
    res.render("PythonTest/home")
});

// route to send the data from the input form from "/". Doing this to 
// try to follow RESTFUL API structure. Posts the data and then just routes 
// back to the same page but with the appriorate output
router.post("/", connectToPython);

// function that is called when we hit the route above
// function that creates queues to be used to pass messages between python script
// and javascript. When called it sends the appriorate input / just kicks of
// the python script and then returns the value returned by the corresponding
// python script
function connectToPython(req, res) {
    var inputs = [];
    amqb.connect('amqb://localhost', function(err, conn) {
    conn.createChannel(function(err, channel) {
        channel.assertQueue(q=resultsQueue, {Durable:true});
        console.log("Waiting for messages in the %s queue", resultsQueue);
        channel.consume(q, 
                        function(msg) {
                            console.log("Received %s in %s queue", msg.content.toString(), resultsQueue) 
                        }, 
                        noAck=false); 
        });
    });
};


module.exports = router;
