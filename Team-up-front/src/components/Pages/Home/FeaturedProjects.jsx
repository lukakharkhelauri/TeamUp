import classes from "../../../modules/FeaturedProjects.module.scss";
import clientProfile from "../../../assets/Home-page-pics/profile-pic.jpg";
import exampleProject from "../../../assets/Home-page-pics/exampleProject.png";
import projectsImgOne from "../../../assets/Home-page-pics/firstProjectImg.png";
import projectsImgTwo from "../../../assets/Home-page-pics/TwoProjectImg.png";
import projectsImgThree from "../../../assets/Home-page-pics/ThreeProjectImg.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const FeaturedProjects = () => {
    const ProjectCardOne = () => (
        <div className={classes["projects"]}>
            <img
                className={classes["project-picture"]}
                src={exampleProject}
                alt="Project"
            />
            <div className={classes["project-description"]}>
                <h4>DevNest</h4>
                <p>
                    DevNest is designed to be the ultimate platform for developers and clients alike — a seamless space where creativity meets opportunity.
                    With an intuitive interface and smart collaboration tools, it makes project development smoother and faster. Easy money, baby.
                </p>
                <br />
                <div className={classes["client-side"]}>
                    <div>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={classes["client-profile"]}
                        />
                        <p>CodeCraft Innovations</p>
                    </div>
                    <h5>$1,275</h5>
                </div>
            </div>
        </div>
    );

    const ProjectCardTwo = () => (
        <div className={classes["projects"]}>
            <img
                className={classes["project-picture"]}
                src={projectsImgOne}
                alt="Project"
            />
            <div className={classes["project-description"]}>
                <h4>LaunchPad Pro</h4>
                <p>
                    LaunchPad Pro is the go-to platform for startups and freelancers.
                    Whether you're a solo dev or a team with a dream, this site connects great ideas with the right talent.
                    Built for simplicity, speed, and that sweet success.
                </p>
                <br />
                <div className={classes["client-side"]}>
                    <div>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={classes["client-profile"]}
                        />
                        <p>Visionary Ventures</p>
                    </div>
                    <h5>$1,549</h5>
                </div>
            </div>
        </div>
    );

    const ProjectCardThree = () => (
        <div className={classes["projects"]}>
            <img
                className={classes["project-picture"]}
                src={projectsImgTwo}
                alt="Project"
            />
            <div className={classes["project-description"]}>
                <h4>SwiftCollab</h4>
                <p>
                  SwiftCollab is your all-in-one collaboration toolkit. From task management to real-time updates,
                  it's made to boost productivity without the stress.
                  For developers and clients looking for results — this is where the money flows.
                </p>
                <br />
                <div className={classes["client-side"]}>
                    <div>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={classes["client-profile"]}
                        />
                        <p>Quantum Edge Solutions</p>
                    </div>
                    <h5>$2,305</h5>
                </div>
            </div>
        </div>
    );

    const ProjectCardFourth = () => (
        <div className={classes["projects"]}>
            <img
                className={classes["project-picture"]}
                src={projectsImgThree}
                alt="Project"
            />
            <div className={classes["project-description"]}>
                <h4>PixelSync</h4>
                <p>
                PixelSync blends sleek design with powerful development tools, making it easy to build, launch, and grow.
                 It’s the best site you didn’t know you needed — until now.
                  Fast builds, fast cash.
                </p>
                <br />
                <div className={classes["client-side"]}>
                    <div>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={classes["client-profile"]}
                        />
                        <p>NeonCore Studios</p>
                    </div>
                    <h5>$1,990</h5>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <center>
                <h1 className={classes["featured-projects-title"]}>
                    Featured Projects
                </h1>
            </center>
            <br />
            <br />

            <div className={classes["projects-container"]}>
                <div className={classes["desktop-view"]}>
                    <div className={classes["projects-grid"]}>
                        <ProjectCardOne />
                        <ProjectCardTwo />
                        <ProjectCardThree />
                        <ProjectCardFourth />
                    </div>
                </div>

                <div className={classes["mobile-view"]}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className={classes["mobile-swiper"]}
                    >
                        <SwiperSlide>
                            <div className={classes["slide-content"]}>
                                <ProjectCardOne />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={classes["slide-content"]}>
                                <ProjectCardTwo />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={classes["slide-content"]}>
                                <ProjectCardThree />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={classes["slide-content"]}>
                                <ProjectCardFourth />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default FeaturedProjects;