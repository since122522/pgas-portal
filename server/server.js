// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Import node-fetch
const Chat = require('./models/Chat');

const app = express();
const port = process.env.PORT || 3001;

// The webhook URL for getting bot replies
const WEBHOOK_URL = "https://workflow.pgas.ph/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat";

// CORS configuration
const allowedOrigins = [
  'https://pgas-chatbot.vercel.app',
  'https://since122522-pgas-portal-fwti.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Get chat history for a user by chat ID
app.get('/api/chat/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (chat) {
      // Return the full chat object, not just messages
      res.json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent chats for a user
app.get('/api/chat/recent/:userId', async (req, res) => {
  try {
    // Find chats for the user, sort by the timestamp of the last message
    const chats = await Chat.find({ userId: req.params.userId })
      .sort({ 'messages.timestamp': -1 })
      .limit(15);
    
    // Map to the format the frontend expects
    const recentChats = chats.map(chat => ({ id: chat._id, title: chat.title || 'New Chat' }));
    res.json(recentChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Save a new message and get a bot reply
app.post('/api/chat/message', async (req, res) => {
  const { userId, text, chatId } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ message: 'userId and text are required' });
  }

  try {
    let chat;

    // Find existing chat or create a new one
    if (chatId) {
      chat = await Chat.findById(chatId);
    } 
    
    if (!chat) {
      const title = text.substring(0, 30); // Create a title from the first message
      chat = new Chat({ userId, title, messages: [] });
    }

    // 1. Add user's message
    chat.messages.push({ sender: 'user', text });
    await chat.save();

    // 2. Call webhook to get bot's reply
    const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, chatId: chat._id.toString() }),
    });

    if (!webhookResponse.ok) {
        throw new Error('Webhook network response was not ok');
    }
    
    const data = await webhookResponse.json();
    const botResponseText = data.output || data.text || data.response || data.message || JSON.stringify(data);

    // 3. Add bot's message
    chat.messages.push({ sender: 'bot', text: botResponseText });
    
    // 4. Save the final conversation and send back to client
    const updatedChat = await chat.save();
    res.status(201).json(updatedChat);

  } catch (error) {
    console.error("Error in /api/chat/message:", error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
