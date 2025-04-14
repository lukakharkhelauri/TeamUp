import Navbar from "./components/Main/Navbar.jsx"
import MainContent from "./components/Pages/Home/MainContent.jsx"
import  "./modules/Scroll.module.scss"
import FeaturedProjects from "./components/Pages/Home/FeaturedProjects.jsx"
import Footer from "./components/Main/Footer.jsx"
import classes from "./modules/App.module.scss"

function App() {

    return (
        <div className={classes["body"]}>
             <Navbar/>
            <div>
            <MainContent/>
            <FeaturedProjects/>
            </div>
            <br/><br/><br/><br/><br/><br/>
            <Footer/>
        </div>
    )
}

export default App