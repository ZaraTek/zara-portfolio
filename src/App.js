import './App.css';
import Dock from './Dock';
import FuzzyText from './FuzzyText';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaSpotify
} from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProjectModal from './ProjectModal'
import ZaraHeadshot from './assets/images/github_avatar.jpg';
import WavingDog from './assets/images/waving_dog.gif';
import PokeChefGif from './assets/images/PokeChef.mp4'
import InstaChefGif from './assets/images/InstaChef_Preview-ezgif.com-resize.mp4';
import LocalVoiceGif from './assets/images/LocalVoice_Clip.mp4'
import WeMakeGif from './assets/images/WeMake.mp4'
import LightRay from './LightRay'

// Splits text into per-letter spans so the light ray can glow each letter
// individually. Letters are grouped into per-word wrappers so a word never
// breaks across lines; wrapping only happens at the spaces between words.
const GlowText = ({ children }) =>
  String(children)
    .split(/(\s+)/)
    .map((chunk, wi) =>
      /^\s+$/.test(chunk)
        ? chunk
        : (
          <span key={wi} className="glow-word">
            {chunk.split('').map((ch, i) => (
              <span key={i} className="glow-letter">
                {ch}
              </span>
            ))}
          </span>
        )
    );

// A letter can be lit by the light ray and/or the mouse cursor. Track each
// source separately and only touch the DOM when the combined state changes.
const setLetterSource = (d, key, val) => {
  if (d[key] === val) return;
  d[key] = val;
  const glow = d.rayOn || d.mouseOn;
  if (glow !== d.glowing) {
    d.el.classList.toggle('letter-glow', glow);
    d.glowing = glow;
  }
};

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const projectCardRefs = useRef([]);
  const musicCardRefs = useRef([]);
  const pfpRef = useRef(null);
  const textRefs = useRef([]);
  // Cached per-letter positions in *page* coordinates so we don't force a
  // layout on every animation frame. { el, cx, cy, on }
  const letterData = useRef([]);

  const measureLetters = useCallback(() => {
    const nodes = document.querySelectorAll('.glow-letter');
    letterData.current = Array.from(nodes).map(el => {
      // Reset any lingering glow so the cached state and DOM stay in sync.
      el.classList.remove('letter-glow');
      const r = el.getBoundingClientRect();
      return {
        el,
        cx: r.left + r.width / 2 + window.scrollX,
        cy: r.top + r.height / 2 + window.scrollY,
        rayOn: false,
        mouseOn: false,
        glowing: false,
      };
    });
  }, []);

  useEffect(() => {
    const selector =
      '.intro span, .spotify-title, .spotify-artist, .project-card';
    textRefs.current = Array.from(document.querySelectorAll(selector));

    // Measure once fonts/layout settle, and again whenever the layout changes.
    measureLetters();
    const id = setTimeout(measureLetters, 300);
    window.addEventListener('resize', measureLetters);
    if (document.fonts?.ready) document.fonts.ready.then(measureLetters);
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measureLetters);
    };
  }, [measureLetters]);

  const handleHeadMove = useCallback((hx, hy) => {
    const PROXIMITY = 100;
    [...projectCardRefs.current, ...musicCardRefs.current, pfpRef.current].forEach(el => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - hx, 0, hx - r.right);
      const dy = Math.max(r.top - hy, 0, hy - r.bottom);
      el.classList.toggle('light-hit', Math.sqrt(dx * dx + dy * dy) < PROXIMITY);
    });

    const TEXT_PROXIMITY = 70;
    textRefs.current.forEach(el => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - hx, 0, hx - r.right);
      const dy = Math.max(r.top - hy, 0, hy - r.bottom);
      el.classList.toggle('text-glow', Math.sqrt(dx * dx + dy * dy) < TEXT_PROXIMITY);
    });

    // Per-letter glow. Positions are cached in page space; convert the head
    // (viewport space) to page space by adding the scroll offset.
    const LETTER_PROXIMITY = 42;
    const px = hx + window.scrollX;
    const py = hy + window.scrollY;
    const data = letterData.current;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const dist = Math.hypot(d.cx - px, d.cy - py);
      setLetterSource(d, 'rayOn', dist < LETTER_PROXIMITY);
    }
  }, []);

  useEffect(() => {
    const LETTER_PROXIMITY = 42;
    const onMove = (e) => {
      const px = e.clientX + window.scrollX;
      const py = e.clientY + window.scrollY;
      const data = letterData.current;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const dist = Math.hypot(d.cx - px, d.cy - py);
        setLetterSource(d, 'mouseOn', dist < LETTER_PROXIMITY);
      }
    };
    const clear = () => {
      const data = letterData.current;
      for (let i = 0; i < data.length; i++) setLetterSource(data[i], 'mouseOn', false);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', clear);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', clear);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      id: 'wemake',
      title: 'WeMake',
      img: WeMakeGif,
      description: "WeMake is a dedicated space to share your art and creative projects. Your profile acts as \"gallery\" meant to display the work you're most proud of. There is an array of templates to choose from whenever you make a post. Whether it's poem, song, short film, or photo shoot, it can be added aesthetically to your page. It acts as a true gallery, displaying the date that you made the project, rather than the date you posted. You'll connect with your friends on the app and view their posts on your feed, or on their profile pages",
      github: 'https://github.com/ZaraTek/WeMake',
      youtube: 'https://www.youtube.com/watch?v=eO9Si5JqbQI',
      devpost: 'https://devpost.com/software/wemake-aqudyg'
    },
    {
      id: 'poke', 
      title: 'PokeChef', 
      img: PokeChefGif,
      description: 'PokeChef is a top-down Pokemon-like game where you fight ingredients in order to collect them. The goal is to collect enough to create a dish, and then move onto the next level.', 
      github: 'https://github.com/COMP301-S125/final-game-project-pokechef/'
    },
    {
      id: 'insta',
      title: 'InstaChef',
      img: InstaChefGif,
      description: "InstaChef takes short-form recipes and transforms them into an instructional format. You can search for any recipe you'd like to make, or browse our feed, and view the recipes in a way that's easy to follow. Our site generates an ingredients list, as well as step-by-step instructions for the video. You can watch the video through, or jump forward or back to a particular step. The instructional step is displayed as it's being shown to you in the video, and you can pause on a step, or have it repeat itself in a loop. These features make our site an intuitive and efficient tool for anyone looking to cook with ease and confidence.",
      github: 'https://github.com/ZaraTek/InstaChef.git',
      youtube: 'https://youtu.be/QX1xf_tY8lg?si=rneJ6kAyYOrfhGru'
    },
    {
      id: 'local',
      title: 'LocalVoice',
      img: LocalVoiceGif,
      description: 'LocalVoice allows citizens to enter their address to find local election candidates, providing basic candidate information (e.g., party affiliation, website, and photo). It offers an email template generator where voters can select key social and political issues to ask about, enabling informed voting. Additionally, voters can enter a specific issue they want to address, which will be integrated into the email template.',
      github: 'https://github.com/ZaraTek/LocalVoice.git',
      youtube: 'https://youtu.be/rJdaIqySguc?si=RExPDLjbT1XQykxV'
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

  return (
    <div className="body">
      <LightRay onHeadMove={handleHeadMove} />
      <header className={`header${scrolled ? ' header--glass' : ''}`}>
        {/* you can use require to bundle static images */}
        <img
          src={WavingDog}
          alt="waving dog"
          className="dog"
        />        
        
        <div className='name'>
          <FuzzyText fontSize="clamp(0.55rem, 6.5vw, 5rem)">
            Zara Tekmen
          </FuzzyText>
        </div>
        
      </header>
      <div className="intro">
        <Intro>
        </Intro>
      </div>

        <div className="main-content">
          <section className="column">
            <header className="column-title projects-title"><GlowText>Projects</GlowText></header>
            <section className="projects">
              {projects.map((proj, i) => (
                <div
                  key={proj.id}
                  className="project-card"
                  onClick={() => setActiveProject(proj)}
                >
                  {proj.title}
                  {proj.img && (
                    <video
                      src={proj.img}
                      ref={el => { projectCardRefs.current[i] = el; }}
                      className={`project-preview${
                        ['wemake', 'insta'].includes(proj.id)
                          ? ' project-preview--tall'
                          : ''
                      }`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`${proj.title} preview`}
                    />
                  )}
                </div>
              ))}
            </section>
          </section>
          
          <div className="column">
            <header className="column-title about-title"><GlowText>About Me</GlowText></header>
            <section className="about-me">
              <p className="paragraph">
                <GlowText>Hi! My name is Zara Tekmen and I'm a third-year student at UNC Chapel Hill, majoring in Computer Science and Music. </GlowText><br></br><br></br>
                <GlowText>My interests are in Cybersecurity, AI/ML, and full-stack development. Check out some of my projects!</GlowText><br></br><br></br>
                <GlowText>I play trombone, guitar, piano, and write music. Check out my most recent album, trombone perfomances, and original music videos!</GlowText>
              </p>
            </section>
            <div className="image-wrapper" ref={pfpRef}>
              <img className="profile-pic" src={ZaraHeadshot} alt="Zara Tekmen headshot"></img>
            </div>  
            <div className="dock-row"> 
              <Dock 
                items={items}
                panelHeight={isMobile ? 60 : 83}
                baseItemSize={isMobile ? 48 : 72}
                magnification={isMobile ? 64 : 90}
              />
            </div>
          </div>          

          <section className="column">
            <header className="column-title music-title"><GlowText>Music</GlowText></header>
            <section className="music">
              <a
                className="spotify-album"
                href="https://open.spotify.com/album/3RV5wXZMvykXU5YqqUVlmB"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="spotify-cover"
                  ref={el => { musicCardRefs.current[0] = el; }}
                  src="https://i.scdn.co/image/ab67616d00001e024db2acc86812d7e4c8025e9f"
                  alt="The Intersection album cover"
                />
                <div className="spotify-info">
                  <span className="spotify-title">The Intersection</span>
                  <span className="spotify-artist">Zxara</span>
                  <span className="spotify-cta">
                    <FaSpotify size={20} />
                  </span>
                </div>
              </a>
              <div className="music-card">
                <iframe
                  className="youtube-container"
                  ref={el => { musicCardRefs.current[1] = el; }}
                  src="https://youtube.com/embed/10nu7D6xvmY"
                  title="The Intersection"
                ></iframe>
              </div>
              <div className="music-card">
                <iframe
                  className="youtube-container"
                  ref={el => { musicCardRefs.current[2] = el; }}
                  src="https://www.youtube.com/embed/y-2T4Jm0nYk"
                  title="Learn to Swim"
                ></iframe>
              </div>
              <div className="music-card">
                <iframe
                  className="youtube-container"
                  ref={el => { musicCardRefs.current[3] = el; }}
                  src="https://www.youtube.com/embed/sI4DNX34JPk"
                  title="YouTube video"
                ></iframe>
              </div>
            </section>
          </section>

        </div>
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
