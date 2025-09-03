// src/ProjectModal.jsx
import React from 'react';
import githubIcon from "./assets/images/github.png";
import youTubeIcon from "./assets/images/youtube.png";

export default function ProjectModal({ project, onClose }) {
  const { title, img, description, github, demo, tech, youtube } = project;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{title}</h2>

       <div className="modal-body">
         {img && (
           <img
             src={require(`./${img}`)}
             alt={`${title} preview`}
             className="modal-preview"
           />
         )}
         <div className="modal-details">
           <p className="paragraph">{description}</p>

           <div className="modal-links">
             {github && (
               <a href={github} target="_blank" rel="noopener noreferrer">
                 GitHub <img src={githubIcon} className="github-icon"></img>
               </a>
             )}
             {youtube && (
               <a href={youtube} target="_blank" rel="noopener noreferrer">
                 GitHub <img src={youTubeIcon} className="youtube-icon"></img>
               </a>
             )}
             {demo && (
               <a href={demo} target="_blank" rel="noopener noreferrer">
                 Live demo
               </a>
             )}
           </div>

           {tech && tech.length > 0 && (
            <div className="modal-tech">
               <strong>Built with:</strong>
               <ul>
                 {tech.map((lib, i) => (
                   <li key={i}>{lib}</li>
                ))}
               </ul>
             </div>
           )}
          </div>
        </div>
      </div>
    </div>
  );
}
