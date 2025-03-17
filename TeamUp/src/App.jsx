import Navbar from "./components/Main/Navbar.jsx"
import MainContent from "./components/Pages/Home/MainContent.jsx"
import  "./modules/Scroll.module.scss"
import FeaturedProjects from "./components/Pages/Home/FeaturedProjects.jsx"
import TopDev from "./components/Pages/Home/Topdev.jsx"
import Footer from "./components/Main/Footer.jsx"

function App() {

    return (
        <>
             <Navbar/>
            <div>
            <MainContent/>
            <FeaturedProjects/>
            <TopDev/>
            </div>
            <br/><br/><br/><br/><br/><br/>
            <Footer/>
        </>
    )
}

export default App