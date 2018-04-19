var amqp = require('amqplib/callback_api');

var connectionObject = {
                          protocol: 'amqp',
                          hostname: 'webdev-bootcamp-hhprogram.c9users.io',
                          port: 8080,
                          username: 'hhprogram',
                          password: 'password',
                          locale: 'en_US',
                          frameMax: 0,
                          heartbeat: 0,
                          vhost: '/',
                        }
                        
function bail(err, conn) {
  console.log(err)
  console.log("connection error")
}

console.log("in receive")
amqp.connect(connectionObject, function(err, conn) {
  console.log("Connected in receive")
  if (err !== null) return bail(err, conn);
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