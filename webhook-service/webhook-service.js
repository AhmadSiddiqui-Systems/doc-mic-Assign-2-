const amqp = require("amqplib");

const rabbitmqURL = "amqp://localhost";

async function main() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    const webhookQueue = "webhook_queue";
    await channel.assertQueue(webhookQueue);

    channel.consume(
      webhookQueue,
      (msg) => {
        console.log(
          "Received a message from data-service:",
          msg.content.toString()
        );
      },
      { noAck: true }
    );

    console.log("Waiting for messages from data-service...");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
