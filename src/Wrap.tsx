import { Github } from 'lucide-react';
import './index.css'
import App from './App.tsx'

const GithubDogEar = () => {
  const foldSize = 100;
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
      
      {/* 1. THE REVEALED BACKGROUND (The "Desk") */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: foldSize,
        height: foldSize,
        backgroundColor: '#181717',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}>
        <a href="https://github.com/your-username/fork" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
          <Github size={32} />
        </a>
      </div>

      {/* 2. THE FOLDED FLAP (The "Dog Ear") */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: foldSize,
        height: foldSize,
        background: 'linear-gradient(135deg, #ffffff 50%, #f0f0f0 50%, #d9d9d9 100%)',
        clipPath: 'polygon(0 0, 100% 0, 0 100%)', // Triangle facing the other way
        boxShadow: '-5px -5px 10px rgba(0,0,0,0.2)',
        zIndex: 10,
        transform: 'rotate(0deg)', // Adjust if you want a messy peel
      }} />

      {/* 3. THE PAGE OVERLAY (With the hole) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'white',
        zIndex: 5,
        // This clips the corner out so the icon and fold show through
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${foldSize}px), calc(100% - ${foldSize}px) 100%, 0 100%)`,
        pointerEvents: 'none'
      }}>
        <App />
      </div>
    </div>
  );
};

export default GithubDogEar;
