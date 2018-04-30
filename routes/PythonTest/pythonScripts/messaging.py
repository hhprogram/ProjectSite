import pika
import sys
import whaleClassifier
import json

def main():
    
    task_queue = "task_queue"
    results_queue = "results"
    # see: http://www.rabbitmq.com/tutorials/tutorial-one-python.html
    print("launching Python messaging script")
    credentials = pika.PlainCredentials("hhprogram", "mypassword")
    virtual_host = "virtual"
    # NOTE: if you leave credentials argument blank it defaults to username: guest, password: guest
    # NOTE: if you leave the port argument blank defaults to 5672
    # NOTE: if you leave virtual host argument blank it defaults to "/"
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', 
                                                                   credentials=credentials,
                                                                   virtual_host="virtual",
                                                                   port=5672))
    channel = connection.channel()
    
    # connecting to the queue that will be used by python and Node.js to communicate
    # both js file and this file create the queue as we may not know the order in which
    # scripts are run and this script my run before the js script and thus a queue has to
    # exist for this consumer to start 'listening' to the queue. And if it already exists
    # it just connects to it and doesn't override it
    channel.queue_declare(queue=task_queue, durable=True)
    
    # queue for outgoing results from python scripts to send back to JS.
    channel.queue_declare(queue=results_queue, durable=True)
    
    # note the signature is required by the pika library. see docs:
    # https://pika.readthedocs.io/en/0.10.0/modules/channel.html#pika.channel.Channel.basic_consume
    # each argument is basically a different type of pika object
    # i.e channel = Pika.Channel
    # The Channel class provides a wrapper for interacting with RabbitMQ implementing the methods and behaviors for an AMQP Channel.
    def callback(channel, method, properties, body):
        """callback method called when consumer finds some new task in the queue to be executed
        this is called. And this won't return anything but at the end of this method we will
        publish our result that we calculated from another python task to the 'results' queue
        that our JS script will be listening to
        body: object where the stringified data lives when passed through the queue. In our application we stringified
        a list of inputs. those request params will be a list with the value of each of these inputs"""
        requestParams = json.loads(body.decode('utf-8'))
        print("inside the callback")
        arg1 = int(requestParams[0])
        arg2 = int(requestParams[1])
        result = whaleClassifier.test(arg1, arg2)
        # what this does it publish the RESULT to the exchange (as producers of content 
        # cannot send stuff directly to queues, they send to exchanges and then exchanges 
        # send to queues. Note Exchange='' is default exchange which then sends to the
        # queue that is listed on the ROUTING_KEY argument.)
        channel.basic_publish(exchange='', 
                              routing_key=results_queue, 
                              body=json.dumps(result),
                              properties=pika.BasicProperties(
                              delivery_mode = 2, # make message persistent
                             ))
        channel.basic_ack(delivery_tag=method.delivery_tag)
        
    
    # note: by default we send back message acknowledgements when tasks are consumed
    # if want to turn this off then add argument no_ack=True
    channel.basic_consume(callback, queue=task_queue)
    
    # enter a 'forever' loop to wait for data to come through the channel to the queue
    channel.start_consuming()
    

if __name__ == "__main__":
    main()