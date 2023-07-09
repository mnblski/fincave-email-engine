const {PubSub} = require('@google-cloud/pubsub');

const gmailPubSubConfig = {
    projectId: 'fincave', // Your Google Cloud Platform project ID
    topicNameOrId: 'new-message-topic', // Name for the new topic to create
    subscriptionName: 'new-message-topic-sub' // Name for the new subscription to create
}

// async function pubSubInit(config) {
//     // Instantiates a client
//     const pubsub = new PubSub({projectId: config.projectId});
// }

async function quickstart(config) {

  const pubsub = new PubSub({projectId: config.projectId});

  // console.log('pubsub init success', pubsub);

  // Receive callbacks for new messages on the subscription
  // pubsub.subscription(config.subscriptionName).on('message', message => {
  //   console.log('Received message:', message.data.toString());
  //   message.ack();
  // })

  // Receive callbacks for errors on the subscription
  // pubsub.subscription(config.subscriptionName).on('error', error => {
  //   console.error('Received error:', error);
  //   process.exit(1); 
  // })


  // Send a message to the topic
  // pubsub.topic(config.topicNameOrId).publishMessage({data: Buffer.from('Test message!')});
}

quickstart(gmailPubSubConfig);

module.exports = {
    pubSubInit: () => quickstart(gmailPubSubConfig),
    gmailPubSubConfig
}


