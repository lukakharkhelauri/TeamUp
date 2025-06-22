import { useEffect, useState } from "react";
import classes from "../../../modules/Messenger/UserMessages.module.scss";
import NavBar from "../../Main/Navbar.jsx";
import MessagesComponent from "./Messages.jsx";
import userProfile from "../../../assets/Home-page-pics/profile-pic.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UserMessages = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            const currentUser = JSON.parse(localStorage.getItem("user"));
            
            if (!currentUser) {
                console.error("No user found in localStorage");
                setLoading(false);
                return;
            }
            
            const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
            
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            const userConversations = conversations.filter(conv => 
                conv.participants.includes(currentUser.id || currentUser._id)
            );
            
            const processedConversations = userConversations.map(conv => {
                const lastMessage = messages
                    .filter(msg => msg.conversation === conv._id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                
                const participantDetails = conv.participants
                    .filter(id => id !== (currentUser.id || currentUser._id))
                    .map(id => {
                        const user = users.find(u => u._id === id || u.id === id);
                        return user || { name: 'Unknown User', _id: id };
                    });
                
                return {
                    ...conv,
                    lastMessage,
                    participants: participantDetails
                };
            });
            
            processedConversations.sort((a, b) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
                return dateB - dateA;
            });
            
            console.log("Processed conversations:", processedConversations);
            setUsersData(processedConversations);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setLoading(false);
        }
    };

    fetchData();
}, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    closeSidebar();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <NavBar />
      <div className={classes["container"]}>
        <div 
          className={`${classes["burger-menu"]} ${isSidebarOpen ? classes["active"] : ""}`}
          onClick={toggleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div 
          className={`${classes["overlay"]} ${isSidebarOpen ? classes["active"] : ""}`}
          onClick={closeSidebar}
        ></div>
        
        <aside className={`${classes["sidebar"]} ${isSidebarOpen ? classes["active"] : ""}`}>
          <div className={classes["for-border-bottom"]}>
            <h1 className={classes["logo"]}>Messages</h1>
            <br />
            <div className={classes["search-box"]}>
              <input type="text" placeholder="Search conversations..." />
            </div>
          </div>
          <br />
          <div className={classes["users-list"]}>
            {loading ? (
              <p>Loading...</p>
            ) : usersData.length > 0 ? (
              usersData.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`${classes["contact-users"]} ${
                    selectedConversation?._id === conversation._id ? classes["selected"] : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <FontAwesomeIcon icon={faUser} className={classes["profile-icon"]} />
                  <div>
                    <h3>{conversation.isGroup ? conversation.groupName : conversation.name}</h3>
                    <div className={classes["price-range"]}>
                      <p>{conversation.isGroup ? "Group" : "Active"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={classes["no-conversations"]}>
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </aside>
        <main className={classes["chat-area"]} onClick={closeSidebar}>
          {selectedConversation ? (
            <MessagesComponent selectedConversation={selectedConversation} />
          ) : (
            <div className={classes["no-chat-selected"]}>
              <h2>Select a conversation to start messaging</h2>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserMessages;