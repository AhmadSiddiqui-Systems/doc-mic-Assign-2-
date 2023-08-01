const amqp = require("amqplib");

const rabbitmqURL = "amqp://localhost";

async function main() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    const dataQueue = "data_queue";
    await channel.assertQueue(dataQueue);

    function forwardToWebhookService(msg) {
      const webhookQueue = "webhook_queue";
      channel.sendToQueue(webhookQueue, Buffer.from(msg.content.toString()));
      console.log(
        "Forwarded message to webhook-service:",
        msg.content.toString()
      );
    }

    channel.consume(
      dataQueue,
      (msg) => {
        console.log("Received a message:", msg.content.toString());
        forwardToWebhookService(msg);
      },
      { noAck: true }
    );

    console.log("Waiting for messages...");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
