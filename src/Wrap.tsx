import { Github } from 'lucide-react';
import './index.css'
import App from './App.tsx'

const GithubDogEar = () => {
  return (
    <>
      {/* 1. THE "UNDERNEATH" ICON */}
      <a
        href="https://github.com/your-username/your-fork"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '120px',
          height: '120px',
          backgroundColor: '#181717',
          zIndex: 1, // Sits behind the main content
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '15px',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
        }}
        // Slight scale up on hover
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Github size={32} />
      </a>

      {/* 2. THE "PAGE" OVERLAY */}
      {/* Wrap your ENTIRE app content in this div */}
      <div style={{
        position: 'relative',
        zIndex: 2, // Higher than the icon
        backgroundColor: 'white',
        minHeight: '100vh',
        width: '100%',
        // This 'snips' the bottom right corner of the white page
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 120px), calc(100% - 120px) 100%, 0 100%)',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
      }}>
        {/* YOUR ACTUAL SITE CONTENT GOES HERE */}
        <App />
      </div>
    </>
  );
};

export default GithubDogEar;
