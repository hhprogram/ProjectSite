var amqp = require('amqplib/callback_api');

console.log("in send")
amqp.connect('amqp://webdev-bootcamp-hhprogram.c9users.io/', function(err, conn) {
  console.log("Connected in receive")
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';
    console.log("channel created")
    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});