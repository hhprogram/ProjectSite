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