const ChatRoom = require("../model/chatroom.model.js");

exports.sendMessage = async (data) => {
  try {
    const { roomId, userName, message } = data;
    const chatMessage = new ChatRoom({ roomId, userName, message });
    await chatMessage.save();
    return chatMessage;
  } catch (err) {
    console.error("Error sending message: ", err);
    throw err;
  }
};

exports.getMessages = async (roomId) => {
  try {
    const messages = await ChatRoom.find({ roomId })
      .sort({ createdAt: 1 })
      .exec();
    return messages;
  } catch (err) {
    console.error("Error getting messages: ", err);
    throw err;
  }
};
