var express = require("express");
var router = express.Router();
var amqp = require("amqplib/callback_api");
// NOTE: need the below to be able to access variables in the .env.default file like process.WHATEVER_KEY_NAME_ENV_FILE
// needed to pass in a JS object with key name path and then the path to the .env.default file I had created. I moved it
// to the home directory of the PythonTest subfolder
require("dotenv").config({path: __dirname + '/.env.default'});
// required in order to run python script so python can start listening to the task queue
const spawn = require("child_process").spawn;
// NOTE: remember need to require body parser and then use it or else cannot easily access
// the request body and other parameters of the request object so easily with dot notation.
var bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({extended: true}));

// note: this assumes that I have set up in the RabbitMQ management plugin hhprogram as a user and their password being
// mypassword AND I have given this user permission to the virtualhost called 'virtual'. If not will give connection error
var connectionObject = {
                          protocol: 'amqp',
                          hostname: 'localhost',
                          port: 5672,
                          username: 'hhprogram',
                          password: 'mypassword',
                          locale: 'en_US',
                          frameMax: 0,
                          heartbeat: 0,
                          vhost: 'virtual', //note: this has to be exactly as the vhost is shown in the rabbitMQ management console.
                        };

// see: http://www.rabbitmq.com/tutorials/tutorial-two-python.html
// see: https://medium.com/@HolmesLaurence/integrating-node-and-python-6b8454bfc272

var resultsQueue = "results";
var taskQueue = "task_queue";

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
    console.log("this is the python path being used: " + process.env.PYTHON);
    var pythonProcess = spawn(process.env.PYTHON, ["./pythonScripts/messaging.py"]);
    console.log("Hello - in the post method")
    var arg1 = req.body.arg1;
    var arg2 = req.body.arg2;
    var inputs = [arg1, arg2];
    amqp.connect(connectionObject, function(err, conn) {
        conn.createChannel(function(err, channel) {
            console.log("creating channel")
            // note: I'm creating the task queue first and sending it to that queue 
            // before the results queue as it makes sense to get the task going first
            // that the results queue depends on 
            // create the task queue that is shared by the python file as we don't know which file 
            // will create it first. Therefore, need to ensure it exists
            channel.assertQueue(q=taskQueue, {Durable:true});
            // actually send the inputs entered in the form to the task queue so that python 
            // can handle them and do its task
            channel.sendToQueue(q=taskQueue, new Buffer(JSON.stringify(inputs)));
            console.log("Sent over:", inputs)
            channel.assertQueue(q=resultsQueue, {Durable:true});
            console.log("Waiting for messages in the %s queue", resultsQueue);
            // NOTE: the argument in the ack() method most be the same argument passed into the function that we anonymously defined
            // as the second argument in the consume() function. This is because this is how rabbitMQ knows which message within the queue
            // has been process and consumed and thus can acknowledge that it is done and is free to delete it. Without this ACK() line 
            // everytime i started up my server the tasks from previous runs were still sitting in the queue and thus consumed again after
            // the first time of each server run, which is not the behavior we wanted. So channel.ack(msg) is required
            channel.consume(resultsQueue, 
                            function(msg) {
                                var result = msg.content.toString();
                                console.log("Received %s in %s queue", result, resultsQueue);
                                console.log("This is the sum of the 2 numbers: %s", result);
                                channel.ack(msg) 
                            }, 
                            noAck=false);

        });
    });
    console.log("Channel supposedly connected");
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



