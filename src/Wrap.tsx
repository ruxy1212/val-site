import { Github } from 'lucide-react';
import './index.css'
import App from './App.tsx'

const GithubDogEar = () => {
  const foldSize = 100;
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '150px',
      height: '150px',
      zIndex: 9999,
      overflow: 'visible'
    }}>
      
      {/* 1. THE REVEALED BACKGROUND (The "Desk") */}
      <a
        href="https://github.com/your-username/fork"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#111',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '20px',
          color: 'white',
          zIndex: 1,
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
        }}
      >
        <Github size={40} />
      </a>

      {/* 2. THE FOLDED FLAP (The "Dog Ear") */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        /* The Gradient: Darker at the "seam", lighter at the curved tip */
        background: 'linear-gradient(135deg, rgba(255,255,255,0) 30%, #444 45%, #bbb 50%, #fafafa 60%, #ffffff 100%)',
        /* The Curve: Using a Path instead of a Polygon for that organic "peel" look */
        clipPath: 'path("M 150 0 C 100 0, 0 100, 0 150 L 150 150 Z")',
        filter: 'drop-shadow(-5px -5px 10px rgba(0,0,0,0.5))',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }} className="peel-flap" />

      {/* 3. THE PAGE OVERLAY (With the hole) */}
      <div style={{
        background: 'white',
        minHeight: '100vh',
        clipPath: 'path("M 0 0 L 100% 0 L 100% calc(100% - 150px) C calc(100% - 50px) calc(100% - 150px), calc(100% - 150px) calc(100% - 50px), calc(100% - 150px) 100% L 0 100% Z")',
      }}>
        <App />
      </div>
    </div>
  );
};

export default GithubDogEar;
