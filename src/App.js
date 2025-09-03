import logo from './logo.svg';
import './App.css';
import SplitText from "./SplitText";
import GlitchText from './GlitchText';
import Dock from './Dock';
import FuzzyText from './FuzzyText';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import React, { useState } from 'react';
import ProjectModal from './ProjectModal'
import { p } from 'framer-motion/client';
import AudioPlayer from './AudioPlayer';

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeSong, setActiveSong] = useState(null);
  const items = [
    {
      icon: <FaGithub size={24} />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/ZaraTek', '_blank')
    },
    {
      icon: <FaLinkedin size={24} />,
      label: 'LinkedIn',
      onClick: () => window.open('https://www.linkedin.com/in/zara-tekmen-415511344/', '_blank')
    },
    {
      icon: <FaInstagram size={24} />,
      label: 'Instagram',
      onClick: () => window.open('https://www.instagram.com/zara.tkmn/', '_blank')
    },
    {
      icon: <FaYoutube size={24} />,
      label: 'YouTube',
      onClick: () => window.open('https://www.youtube.com/@zaratekmen', '_blank')
    },
  ];

  const projects = [
    {
      id: 'audio',
      title: 'AudioVault',
      img: '',
      description: 'In Progress',
      github: ''
    },
    {
      id: 'poke', 
      title: 'PokeChef', 
      img: 'assets/images/PokeChef.gif', 
      description: 'PokeChef is a top-down Pokemon-like game where you fight ingredients in order to collect them. The goal is to collect enough to create a dish, and then move onto the next level.', 
      github: 'https://github.com/COMP301-S125/final-game-project-pokechef/'
    },
    {
      id: 'insta',
      title: 'InstaChef',
      img: 'assets/images/InstaChef_Preview.gif',
      description: "InstaChef takes short-form recipes and transforms them into an instructional format. You can search for any recipe you'd like to make, or browse our feed, and view the recipes in a way that's easy to follow. Our site generates an ingredients list, as well as step-by-step instructions for the video. You can watch the video through, or jump forward or back to a particular step. The instructional step is displayed as it's being shown to you in the video, and you can pause on a step, or have it repeat itself in a loop. These features make our site an intuitive and efficient tool for anyone looking to cook with ease and confidence.",
      github: 'https://github.com/ZaraTek/InstaChef.git',
      youtube: 'https://youtu.be/QX1xf_tY8lg?si=rneJ6kAyYOrfhGru'
    },
    {
      id: 'local',
      title: 'LocalVoice',
      img: 'assets/images/LocalVoice_Clip.gif',
      description: 'LocalVoice allows citizens to enter their address to find local election candidates, providing basic candidate information (e.g., party affiliation, website, and photo). It offers an email template generator where voters can select key social and political issues to ask about, enabling informed voting. Additionally, voters can enter a specific issue they want to address, which will be integrated into the email template.',
      github: 'https://github.com/ZaraTek/LocalVoice.git',
      youtube: 'https://youtu.be/rJdaIqySguc?si=RExPDLjbT1XQykxV'
    }
    
  ]

  const songs = [
    {
      id: "enchanted",
      title: "Enchanted",
      play: 'assets/images/play_button_2.png',
      pause: 'assets/images/pause_button_2.png',
      audio: "assets/audio/Enchanted (Zara's Version).mp3"
    },
    {
      id: "ginger_ale",
      title: "Ginger Ale",
      play: 'assets/images/play_button_2.png',
      pause: 'assets/images/pause_button_2.png',
      audio: "assets/audio/ginger ale.mp3"
    }
  ]


  const Intro = () => {
    return (
      <TypeAnimation
        sequence={[
          'Hi, my name is Zara.',
          1000,
          'Welcome to my website!',
          1000
        ]}
        wrapper="span"
        speed={50}
        style={{ fontSize: '2em', display: 'inline-block' }}
        repeat={Infinity}
      />
    );
  };

  const handleAnimationComplete = () =>
    console.log("All letters have animated!");

  return (
    <div className="body">
      <header className="header">
        {/* you can use require to bundle static images */}
        <img
          src={require("./assets/images/waving_dog.gif")}
          alt="waving dog"
          className="dog"
        />        
        
        <div className='name'>
          <FuzzyText>
            Zara Tekmen
          </FuzzyText>
        </div>
        
      </header>
      <div className="under-header">
        <div className="intro">
          <Intro>
          </Intro>
        </div>

        <div className="main-content">
          <section className="column">
            <section className="projects">
              <header>Projects</header>
              {/* 3️⃣ Map over `projects` instead of hard-coding */}
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="project-card"
                  onClick={() => setActiveProject(proj)}   // open modal
                >
                  {proj.title}
                  {proj.img && (
                    <img
                      src={require(`./${proj.img}`)}
                      className="project-preview"
                      alt={`${proj.title} preview`}
                    />
                  )}
                </div>
              ))}
            </section>
          </section>
          
          <div className="column">
            <section className="about-me">
              <header>About Me</header>
              <p className="paragraph">
                Hi! My name is Zara Tekmen and I'm a second-year student at UNC Chapel Hill, majoring in Computer Science and Music. <br></br><br></br>
                I'm interested in full-stack software development, AI/ML, and cybersecurity. Check out my Hackathon submissions and other projects to the left!<br></br><br></br>
                I play the trombone, guitar, and piano, and like to play and listen to all genres of music. Check out my originals songs and trombone performances to the right!
              </p>
            </section>
            <section className="profile-pic">
              test
            </section>  
          </div>          

          <section className="column">
            <section className="music">
              <header>Music</header>
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="music-card"
                  onClick={() => setActiveSong(song)}   // open modal
                >
                  <AudioPlayer
                    src={require(`./${song.audio}`)}
                    title={`${song.title}`}
                    playIcon={<img src={require(`./${song.play}`)} alt="" style={{ width: 32, height: 32 }} />}
                    pauseIcon={<img src={require(`./${song.pause}`)} alt="" style={{ width: 32, height: 32 }} />}
                  />
                </div>
              ))}
              <div className="music-card">
                <iframe 
                  className="youtube-container"
                  src="https://youtube.com/embed/10nu7D6xvmY"
                ></iframe>
              </div>
            </section>
          </section>
          

          <div className="dock-row"> 
            <Dock 
              items={items}
              panelHeight={83}
              baseItemSize={72}
              magnification={90}
            />
          </div>
          

        </div>
        
        
        
      </div>
      {/* 4️⃣ Conditionally render your modal at the very end */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
      
        
    </div>
    
  );
}

export default App;
