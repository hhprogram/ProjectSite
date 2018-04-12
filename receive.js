var amqp = require('amqplib/callback_api');

console.log("in receive")
amqp.connect('amqp://webdev-bootcamp-hhprogram.c9users.io/', function(err, conn) {
  console.log("Connected in receive")
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    console.log("channel created")
    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});