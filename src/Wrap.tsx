import { Github } from 'lucide-react';
import './index.css'
import './custom.css'
import App from './App.tsx'

const GithubDogEar = () => {
 // const foldSize = 100;
  return (
    <>
     <button className="dogear-button">
        <Github size={20} />
      </button>

      {/* Folded Corner */}
      <div className="dogear-fold" />
        <App />
    </>
  );
};

export default GithubDogEar;
