const express = require('express');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'name email')
    .sort({ createdAt: -1 });
  res.json(conversations);
});

router.get('/:conversationId/messages', async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'name email')
    .sort({ timestamp: 1 });
  res.json(messages);
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
        const { participants, isGroup, groupName } = req.body;
        
        const newConversation = new Conversation({
            participants,
            isGroup,
            groupName
        });

        await newConversation.save();

        // Create initial message to start the group
        const initialMessage = new Message({
            conversation: newConversation._id,
            sender: participants[participants.length - 1], // client's ID (last in participants array)
            content: `Group created for project: ${groupName}`
        });

        await initialMessage.save();

        res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, message: 'Error creating conversation' });
    }
});

module.exports = router;