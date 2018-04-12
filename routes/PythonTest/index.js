var express = require("express");
var router = express.Router();
var amqb = require("amqplib/callback_api");
// NOTE: remember need to require body parser and then use it or else cannot easily access
// the request body and other parameters of the request object so easily with dot notation.
var bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({extended: true}));

// see: http://www.rabbitmq.com/tutorials/tutorial-two-python.html

var resultsQueue = "results";
var taskQueue = "taskQueue";

// note: I don't have to put "/PythonTest" in front of each of these URLs. because 
// in my app.js file. I have told Express that everything in this file
// should have the path /PythonTest prepended to it
// handler - the landing page for this route will just be the input form as well
router.get("/", function(req, res) {
    // note: that I don't have to put .. in the path in the 'render' argument because by default express prepends 'views' directory for all template paths
    res.render("PythonTest/home");
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
    console.log("Hello - in the post method")
    var arg1 = req.body.arg1;
    var arg2 = req.body.arg2;
    var inputs = [arg1, arg2];
    amqb.connect('amqp://webdev-bootcamp-hhprogram.c9users.io', function(err, conn) {
        conn.createChannel(function(err, channel) {
        // note: I'm creating the task queue first and sending it to that queue 
        // before the results queue as it makes sense to get the task going first
        // that the results queue depends on 
        // create the task queue that is shared by the python file as we don't know which file 
        // will create it first. Therefore, need to ensure it exists
        channel.assertQueue(q=taskQueue, {Durable:true});
        // actually send the inputs entered in the form to the task queue so that python 
        // can handle them and do its task
        channel.sendToQueue(q=taskQueue, new Buffer(JSON.stringify(inputs)));
        channel.assertQueue(q=resultsQueue, {Durable:true});
        console.log("Waiting for messages in the %s queue", resultsQueue);
        channel.consume(q, 
                        function(msg) {
                            console.log("Received %s in %s queue", msg.content.toString(), resultsQueue);
                        }, 
                        noAck=false);

        });
    });
};

module.exports = router;

// var amqp = require(‘amqplib/callback_api’);
// app.get(‘/dalembert’, callD_alembert);
// function callD_alembert3(req, res) {
//   var input = [
//     req.query.funds, // starting funds
//     req.query.size, // (initial) wager size
//     req.query.count, // wager count — number of wagers per sim
//     req.query.sims // number of simulations
//   ]
//   amqp.connect(‘amqp://localhost’, function (err, conn) {
//     conn.createChannel(function (err, ch) {
//       var simulations = ‘simulations’;
//       ch.assertQueue(simulations, { durable: false });
//       var results = ‘results’;
//       ch.assertQueue(results, { durable: false });
//       ch.sendToQueue(simulations, new Buffer(JSON.stringify(input)));
//       ch.consume(results, function (msg) {
//         res.send(msg.content.toString())
//       }, { noAck: true });
//     });
//     setTimeout(function () { conn.close(); }, 500); 
//     });
// }



