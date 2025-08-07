module.exports = async function (context, myQueueItem) {
  let data;

  // Check if the message is base64 encoded (string), or already an object
  try {
    if (typeof myQueueItem === 'string') {
      const decoded = Buffer.from(myQueueItem, 'base64').toString();
      data = JSON.parse(decoded);
    } else {
      data = myQueueItem;
    }

    context.log(`📦 Processing reorder for ${data.item}`);
    context.log(`🔁 Quantity: ${data.quantity}`);
    context.log(`✅ Reorder sent (simulated)`);
  } catch (err) {
    context.log.error('❌ Error processing queue message:', err);
  }
};
