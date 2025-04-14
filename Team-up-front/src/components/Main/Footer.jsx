import classes from "../../modules/Footer.module.scss";

const Footer = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.container}>
                <div className={classes.footerGrid}>
                    <div className={classes.footerSection}>
                        <h3>About Team Up</h3>
                        <p>Team Up is a collaborative platform designed to bring people together for meaningful projects and innovative solutions.</p>
                    </div>
                    
                    <div className={classes.footerSection}>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/projects">Projects</a></li>
                            <li><a href="/FindDevelopers">Find Developers</a></li>
                            <li>Auction</li>
                        </ul>
                    </div>

                    <div className={classes.footerSection}>
                        <h3>Support</h3>
                        <ul>
                            <li><a href="/faq">FAQ</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className={classes.footerSection}>
                        <h3>Connect With Us</h3>
                        <ul>
                            <li><a href="https://twitter.com">Twitter</a></li>
                            <li><a href="https://linkedin.com">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className={classes.bottomBar}>
                    <p className={classes.copyright}>© 2025 Team Up. All rights reserved.</p>
                    <div className={classes.legalLinks}>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/cookies">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;