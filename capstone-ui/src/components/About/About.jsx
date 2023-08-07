import * as React from "react";
import "./About.css";
import usImage from "./IMG_4577.jpg";
import nyaImage from "./IMG_3249.jpg";
import ayoImage from "./IMG_6683.jpg";

// import jordanImage from "INSERT HERE YOUR FILE"
// import ayoImage from "INSERT HERE YOUR FILE"
import { Link } from "react-router-dom";
import ButtonMailto from "../EventsPage/ButtonMailto";

export default function About() {
  return (
    <div className="about">
      {/* <h2> We are a passionate team of technology enthusiasts dedicated to helping high school seniors embark on their journey to higher education. Our mission is to provide a personalized and seamless experience for students as they explore and discover the perfect colleges that align with their unique interests, aspirations, and academic accomplishments.</h2> */}
      <div className="us_biography">
      <h1 className="creators_header">
        Meet The Creators
      </h1>

      <div className="about_spliter">
        <div className="us_leftside">
        <img className="us-photo" src={usImage} alt="Us Image" />
        </div>
        <div className="rightside">
          <span className="rightside_text">
          We are a passionate team of three college students dedicated to
          <b className="bio-important-words">
            {" "}
            revolutionizing the college search experience{" "}
          </b>{" "}
          for high school seniors. With first-hand knowledge of the challenges
          and excitement that come with this pivotal stage of life throughout
          the college application process, we have combined our unique
          perspectives, skills, and aspirations to create a platform that{" "}
          <b className="bio-important-words">empowers students </b>to discover
          their ideal colleges based on interests and academic achievements.
            <div>
            </div>
          </span>
        </div>
      </div>
    </div>
      {/* <div className="us">
        <img className="us-photo" src={usImage} alt="Us Image" />
        <div className="about-bio">
          We are a passionate team of 3 college students dedicated to
          <b className="bio-important-words">
            {" "}
            revolutionizing the college search experience{" "}
          </b>{" "}
          for high school seniors. With first-hand knowledge of the challenges
          and excitement that come with this pivotal stage of life throughout
          the college application process, we have combined our unique
          perspectives, skills, and aspirations to create a platform that{" "}
          <b className="bio-important-words">empowers students </b>to discover
          their ideal colleges based on interests and academic achievements.
        </div>
      </div> */}
      {/* <hr className="about-break" /> */}
      <h1 className="team-header"> Our Team </h1>

      <div className="all_creators">
        <div className="creator-bio">
          <div className="image-container">
            <img className="nya-headshot" src={ayoImage} alt="Nya Image" />
            <p className="overlay-text" style={{ fontWeight: "bold" }}>
              Junior at University of Maryland studying Computer Science.
            </p>
          </div>
          <h2 className="bio_name">Ayomide Adetunji</h2>
          <h3 className="nya-uni">University of Maryland, '25 </h3>
          <h3 className="nya-major">Computer Science</h3>
          <div className="nya-contact">
            <h3 className="nya-subsection">
              <div className="linkedin">
                <Link to="https://www.linkedin.com/mwlite/in/ayomide-adetunji-7b87091ba">
                  LinkedIn
                </Link>
              </div>
              <div className="nya-mailto">
                <ButtonMailto
                  label="Email"
                  mailto={"mailto:ayomide0528@gmail.com"}
                ></ButtonMailto>
              </div>
            </h3>{" "}
          </div>
        </div>
        <div className="creator-bio">
          <div className="image-container">
            <img className="nya-headshot" src={nyaImage} alt="Nya Image" />
            <p className="overlay-text" style={{ fontWeight: "bold" }}>
              Junior at Brown University studying Applied Mathematics and
              Computer Science.
            </p>
          </div>
          <h2 className="bio_name">Jordan Sarkodie</h2>
          <h3 className="nya-uni"> Andrews University, '25 </h3>
          <h3 className="nya-major">Computer Science</h3>
          <div className="nya-contact">
            <h3 className="nya-subsection">
              <div className="linkedin">
                <Link to="https://www.linkedin.com/in/nya-haseley-ayende">
                  LinkedIn
                </Link>
              </div>
              <div className="nya-mailto">
                <ButtonMailto
                  label="Email"
                  mailto={"mailto:nylevenya@hotmail.com"}
                ></ButtonMailto>
              </div>
            </h3>{" "}
          </div>
        </div>
        <div className="creator-bio">
          <div className="image-container">
            <img className="nya-headshot" src={nyaImage} alt="Nya Image" />
            <p className="overlay-text" style={{ fontWeight: "bold" }}>
              Junior at Brown University studying Applied Mathematics and
              Computer Science.
            </p>
          </div>
          <h2 className="bio_name">Nya Haseley-Ayende</h2>
          <h3 className="nya-uni"> Brown University, '25 </h3>
          <h3 className="nya-major">Applied Mathematics & Computer Science</h3>
          <div className="nya-contact">
            <h3 className="nya-subsection">
              <div className="linkedin">
                <Link to="https://www.linkedin.com/in/nya-haseley-ayende">
                  LinkedIn
                </Link>
              </div>
              <div className="nya-mailto">
                <ButtonMailto
                  label="Email"
                  mailto={"mailto:nylevenya@hotmail.com"}
                ></ButtonMailto>
              </div>
            </h3>{" "}
          </div>
        </div>
      </div>

      {/* <img className="jordan-headshot" src={jordanImage} alt="Jordan Image" /> */}
      {/* <img className="ayo-headshot" src={ayoImage} alt="Ayomide Image" /> */}

      <div className="about-summary">
        We are excited to be a part of your educational journey and are here to
        support you every step of the way. As we continue to expand and refine
        our application, we remain open and eager to engage with you,
        collaborate, and ultimately guide you toward the colleges where you can
        flourish and create lasting impact. Our collaborative effort and shared
        vision have culminated in this platform, and we can't wait to see the
        positive impact it has on your path to higher education!
      </div>
      <div className="header">
        {/* <div class="overlay">
        <div class="jumbotron" id="header1">
            
        </div>
    </div> */}
      </div>
    </div>
  );
}
