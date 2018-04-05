import pika
import sys

# see: http://www.rabbitmq.com/tutorials/tutorial-one-python.html

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# connecting to the queue that will be used by python and Node.js to communicate
# both js file and this file create the queue as we may not know the order in which
# scripts are run and this script my run before the js script and thus a queue has to
# exist for this consumer to start 'listening' to the queue. And if it already exists
# it just connects to it and doesn't override it
channel.queue_declare(queue="task_queue", durable=True)

# queue for outgoing results from python scripts to send back to JS.
channel.queue_declare(queue="results", durable=True)

# note the signature is required by the pika library. see docs:
# https://pika.readthedocs.io/en/0.10.0/modules/channel.html#pika.channel.Channel.basic_consume
# each argument is basically a different type of pika object
# i.e channel = Pika.Channel
# The Channel class provides a wrapper for interacting with RabbitMQ implementing the methods and behaviors for an AMQP Channel.
def callback(channel, method, properties, body):
    """callback method called when consumer finds some new task in the queue to be executed
    this is called"""

# note: by default we send back message acknowledgements when tasks are consumed
# if want to turn this off then add argument no_ack=True
channel.basic_consume(callback, queue='task_queue')

# enter a 'forever' loop to wait for data to come through the channel to the queue
channel.start_consuming()
    

    