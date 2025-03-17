import classes from "../../../modules/FeaturedProjects.module.scss"
import clientProfile from "../../../assets/Home-page-pics/profile-pic.jpg"
import exampleProject from "../../../assets/Home-page-pics/exampleProject.png"

const FeaturedProjects = () => {
    return (
        <>
            <center><h1 className={classes["featured-projects-title"]}>Featured Projects</h1></center>

            <br/><br/>

            <div className={classes['projects-side']}>

                <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                    <div className={classes["project-description"]}>
                        <h4>Project Name</h4>
                        <p>
                            description:
                            it will be best site
                            ever for clien and
                            developers easy money
                            baby.
                        </p>
                        <br/>
                        <div className={classes["client-side"]}>
                            <div>
                                <img className={classes["client-profile"]} src={clientProfile}/>
                                <p>Client Name</p>
                            </div>

                            <h5>$1,000</h5>
                        </div>
                    </div>
                </div>

                <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                    <div className={classes["project-description"]}>
                        <h4>Project Name</h4>
                        <p>
                            description:
                            it will be best site
                            ever for clien and
                            developers easy money
                            baby.
                        </p>
                        <br/>
                        <div className={classes["client-side"]}>
                            <div>
                                <img className={classes["client-profile"]} src={clientProfile}/>
                                <p>Client Name</p>
                            </div>

                            <h5>$1,000</h5>
                        </div>
                    </div>
                </div>

                <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                    <div className={classes["project-description"]}>
                        <h4>Project Name</h4>
                        <p>
                            description:
                            it will be best site
                            ever for clien and
                            developers easy money
                            baby.
                        </p>
                        <br/>
                        <div className={classes["client-side"]}>
                            <div>
                                <img className={classes["client-profile"]} src={clientProfile}/>
                                <p>Client Name</p>
                            </div>

                            <h5>$1,000</h5>
                        </div>
                    </div>
                </div>

                <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                    <div className={classes["project-description"]}>
                        <h4>Project Name</h4>
                        <p>
                            description:
                            it will be best site
                            ever for clien and
                            developers easy money
                            baby.
                        </p>
                        <br/>
                        <div className={classes["client-side"]}>
                            <div>
                                <img className={classes["client-profile"]} src={clientProfile}/>
                                <p>Client Name</p>
                            </div>

                            <h5>$1,000</h5>
                        </div>
                    </div>
                </div>

                <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                    <div className={classes["project-description"]}>
                        <h4>Project Name</h4>
                        <p>
                            description:
                            it will be best site
                            ever for clien and
                            developers easy money
                            baby.
                        </p>
                        <br/>
                        <div className={classes["client-side"]}>
                            <div>
                                <img className={classes["client-profile"]} src={clientProfile}/>
                                <p>Client Name</p>
                            </div>

                            <h5>$1,000</h5>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default FeaturedProjects