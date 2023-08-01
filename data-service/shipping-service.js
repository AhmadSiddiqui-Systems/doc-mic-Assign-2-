const amqp = require("amqplib");

const rabbitmqURL = "amqp://localhost";

async function sendMessage(payload) {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    const dataQueue = "data_queue";
    await channel.assertQueue(dataQueue);
    channel.sendToQueue(dataQueue, Buffer.from(payload));
    console.log("Sent a message to data-service:", payload);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

sendMessage("Shipping service payload data");
