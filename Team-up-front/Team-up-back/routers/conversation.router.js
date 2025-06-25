const express = require('express');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const User = require('../models/users.model');
const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    })
    .populate('participants', 'name email profilePicture')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:conversationId/messages', async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    })
    .populate('sender', 'name email profilePicture')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:senderId/:receiverId/messages', async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.json([]);
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name email')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { participants, initialMessage, isGroup, groupName } = req.body;
    
    const conversation = new Conversation({
      participants,
      lastMessage: null,
      isGroup: isGroup || false,
      groupName: groupName || null
    });
    await conversation.save();
    
    if (initialMessage) {
      const message = new Message({
        conversation: conversation._id,
        sender: initialMessage.sender,
        content: initialMessage.content
      });
      await message.save();

      conversation.lastMessage = message._id;
      await conversation.save();
    }
    
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage');
    
    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:conversationId/messages', async (req, res) => {
  try {
    const { sender, content } = req.body;
    
    const message = new Message({
      conversation: req.params.conversationId,
      sender,
      content
    });
    await message.save();
    
    await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      { lastMessage: message._id }
    );

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profilePicture');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;