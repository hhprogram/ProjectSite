var amqp = require('amqplib/callback_api');
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
                        
function bail(err, conn) {
  console.log(err)
  console.log(conn)
  console.log("ERROR!")
};

function bail2(err, conn) {
  console.log(err)
  console.log(conn)
  console.log("ERROR2!")
};

console.log("in send");
amqp.connect(connectionObject, function(err, conn) {
  if (err !== null) return bail(err, conn);
  console.log("Connected in receive")
  conn.createChannel(function(err, ch) {
    if (err !== null) return bail2(err, conn);
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
