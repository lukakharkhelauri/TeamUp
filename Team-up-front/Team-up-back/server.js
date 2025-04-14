const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectMongoDatabase = require('./database/mongodb-connect');
const cors = require('cors');
const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');
const Connection = require('./models/connection.model');

const application = express();
const server = http.createServer(application);

application.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

application.use(express.json());
application.use('/login', require('./routers/login.router'));
application.use('/users', require('./routers/users.router'));
application.use('/requests', require("./routers/request.router"));
application.use('/conversations', require('./routers/conversation.router'));
application.use('/connections', require('./routers/connections.router'));
application.use('/projects', require('./routers/projects.router'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined private room`);
  });

  socket.on('joinConversation', (conversationId) => {
    console.log(`User ${socket.id} joining group conversation ${conversationId}`);
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('sendMessage', async ({ senderId, conversationId, content, isGroup }) => {
    try {
      //console.log(`sendMessage received: senderId=${senderId}, conversationId=${conversationId}, content=${content}`);
    
      if (!senderId || !conversationId || !content) {
        console.log("Missing required fields for sending message");
        return;
      }
    
      let message;
    
      if (isGroup) {
        const conversation = await Conversation.findById(conversationId).populate('participants');
        if (!conversation) {
          return;
        }
  
        message = new Message({
          conversation: conversation._id,
          sender: senderId,
          content,
        });
  
        await message.save();
  
        const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

        io.to(conversationId).emit('receiveMessage', populatedMessage);
  
      } else {
        let conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          const existingConversation = await Conversation.findOne({
            participants: { $all: [senderId, conversationId] },
            isGroup: false,
          });
    
          if (!existingConversation) {
            conversation = new Conversation({
              participants: [senderId, conversationId],
              isGroup: false,
            });
            await conversation.save();
          } else {
            conversation = existingConversation;
          }
        }
  
        message = new Message({
          conversation: conversation._id,
          sender: senderId,
          content,
        });
        await message.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

        io.to(conversationId).emit('receiveMessage', populatedMessage);
      }
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  
  
  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



const PORT = 5005;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectMongoDatabase();
});