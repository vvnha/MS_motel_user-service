const amqplib = require('amqplib');
const config = require('../../config');
const { subscribeEvents } = require('../../services/users-services');

const { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME } =
  config.get('rabittMQ');

// create channel
module.exports.createChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    // distribute messages to other services
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false);

    return channel;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// publish message (send message)
module.exports.publishMessage = async (channel, bindingKey, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// subscribe message (listen and reveive message)
module.exports.subscribeMessage = async (channel, service, bindingKey) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);

  // taking from exchange => bind queue
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);
  // pop msg from binded queue
  channel.consume(appQueue.queue, async (data) => {
    console.log('receive data');
    const event = JSON.parse(data.content.toString());
    await subscribeEvents(event);
    channel.ack(data);
  });
};
