import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx';
import SignUp from "./components/Pages/SingIn/SignUp.jsx";
import SignIn from "./components/Pages/SingIn/SignIn.jsx";
import Request from "./components/Pages/DevRequests/Request.jsx"
import UserMessages from "./components/Pages/Messenger/UserMessages.jsx"
import Profile from "./components/Pages/Profile/Profile.jsx"
import FindDevelopers from "./components/Pages/FindDevelopers/FindDevelopers.jsx"
import Projects from "./components/Pages/Projects/Projects.jsx"

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/Request" element={<Request />} />
            <Route path="/Messenger" element={<UserMessages />} />
            <Route path="/FindDevelopers" element={<FindDevelopers />} />
            <Route path="/Projects" element={<Projects />} />
            <Route path="/Profile" element={<Profile />} />
        </Routes>
    </BrowserRouter>
)
