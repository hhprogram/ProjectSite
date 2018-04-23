var amqp = require('amqplib/callback_api');

// note: this assumes that I have set up in the RabbitMQ management plugin hhprogram as a user and their password being
// mypassword AND I have given this user permission to the virtualhost called 'virtual' If not will give connection error
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