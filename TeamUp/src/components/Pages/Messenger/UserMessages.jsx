import { useEffect, useState } from "react";
import axios from "axios";
import classes from "../../../modules/Messenger/UserMessages.module.scss";
import NavBar from "../../Main/Navbar.jsx";
import Messages from "./Messages.jsx";
import userProfile from "../../../assets/Home-page-pics/profile-pic.jpg";

const UserMessages = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);

        const conversationsResponse = await axios.get(`http://localhost:5005/conversations/${currentUser.id}`);
        const conversations = conversationsResponse.data;

        const connectionsResponse = await axios.get(`http://localhost:5005/connections/user/${currentUser.id}`);
        const connections = connectionsResponse.data.connections || [];

        const allConversations = conversations.map((conv) => {
          if (conv.isGroup) {
            return {
              ...conv,
              isGroup: true,
              groupName: conv.groupName,
            };
          } else {
            const connection = connections.find((conn) => {
              const otherUser = conn.developerId._id === currentUser.id ? conn.clientId : conn.developerId;
              return conv.participants.some(
                (participant) => participant._id === otherUser._id
              );
            });

            const otherParticipant = conv.participants.find(
              (participant) => participant._id !== currentUser.id
            );

            return {
              ...conv,
              isGroup: false,
              name: otherParticipant?.name || "Unknown User",
              connectionId: connection ? connection._id : null,
            };
          }
        });
        setUsersData(allConversations);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

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
              usersData.filter((user) => user.name !== localStorage.getItem("userName")).map((conversation) => (
                <div
                  key={conversation._id}
                  className={`${classes["contact-users"]} ${
                    selectedConversation?._id === conversation._id ? classes["selected"] : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <img src={userProfile} alt="User profile" />
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
            <Messages selectedConversation={selectedConversation} />
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