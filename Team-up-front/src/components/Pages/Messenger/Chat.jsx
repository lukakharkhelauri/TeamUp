import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Get messages from localStorage
                const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
                
                // Filter messages for current conversation
                const conversationMessages = allMessages
                    .filter(msg => msg.conversation === conversation._id)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                setMessages(conversationMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (conversation) {
            fetchMessages();
        }
    }, [conversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) return;
        
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            
            // Create new message object
            const messageData = {
                _id: Date.now().toString(), // Generate a unique ID
                conversation: conversation._id,
                sender: currentUser.id || currentUser._id,
                content: newMessage.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Get existing messages
            const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
            
            // Add new message
            existingMessages.push(messageData);
            
            // Save back to localStorage
            localStorage.setItem('messages', JSON.stringify(existingMessages));
            
            // Update conversation's last message
            const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
            const conversationIndex = conversations.findIndex(c => c._id === conversation._id);
            
            if (conversationIndex !== -1) {
                conversations[conversationIndex].lastMessage = messageData;
                localStorage.setItem('conversations', JSON.stringify(conversations));
            }
            
            // Update local state
            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
            
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default Chat; 