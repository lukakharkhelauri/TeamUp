import React, { useState, useEffect, useRef } from "react"; 
import { io } from "socket.io-client";
import classes from "../../../modules/Messenger/Messages.module.scss";
import profilePicture from "../../../assets/Home-page-pics/profile-pic.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Messages = ({ selectedConversation }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const storedUser = localStorage.getItem("userName");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          setCurrentUserId(currentUser._id || currentUser.id);
        }

        if (selectedConversation) {
          if (selectedConversation.isGroup) {
            const participants = selectedConversation.participants || [];
            if (participants.length > 0) {
              const selectedUserData = participants[0];
              if (selectedUserData) {
                setSelectedUserId(selectedUserData._id || selectedUserData.id);
              }
            }
          } else {
            setSelectedUserId(selectedConversation._id);
          }
        }
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    };

    fetchUserIds();
  }, [selectedConversation]);

  useEffect(() => {
    const newSocket = io("http://localhost:5005", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedUserId && socket && currentUserId) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:5005/conversations/${selectedConversation._id}/messages`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();

      if (!selectedConversation.isGroup) {
        socket.emit('join', selectedUserId);
      } else {
        socket.emit('joinConversation', selectedConversation._id);
      }
    }
  }, [selectedUserId, socket, currentUserId, selectedConversation]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation && currentUserId) {
      const newMessage = {
        sender: currentUserId,
        content: message,
      };

      try {
        const response = await fetch(
          `http://localhost:5005/conversations/${selectedConversation._id}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMessage),
          }
        );
        if (response.ok) {
          const savedMessage = await response.json();
          setMessages(prev => [...prev, savedMessage]);
          setMessage("");
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className={classes["messages-tab"]}>
      <div>
        {selectedConversation ? (
          <div className={classes["messages-tab"]}>
            <div className={classes["user-chat"]}>
              <FontAwesomeIcon icon={faUser} className={classes["profile-icon"]} />
              <h1>{selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.name}</h1>
            </div>
            <br />
            <div className={classes["texts-side"]} ref={messagesEndRef}>
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={msg.sender._id === currentUserId ? classes["person-1"] : classes["person-2"]}
                >
                  <p className={classes["sender-name"]}>{msg.sender.name}</p> 
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <div className={classes["message-input"]}>
              <input
                type="text"
                placeholder="Aa"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <h1>Select user to chat</h1>
        )}
      </div>
    </div>
  );
};

export default Messages;
