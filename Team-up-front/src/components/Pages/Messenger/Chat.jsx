import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
                
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
            
            const messageData = {
                _id: Date.now().toString(),
                conversation: conversation._id,
                sender: currentUser.id || currentUser._id,
                content: newMessage.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
            
            existingMessages.push(messageData);
            localStorage.setItem('messages', JSON.stringify(existingMessages));
            
            const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
            const conversationIndex = conversations.findIndex(c => c._id === conversation._id);
            
            if (conversationIndex !== -1) {
                conversations[conversationIndex].lastMessage = messageData;
                localStorage.setItem('conversations', JSON.stringify(conversations));
            }
            
            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
            
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            
        </div>
    );
};

export default Chat; 