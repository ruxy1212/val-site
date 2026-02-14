import { Github } from 'lucide-react';
import './index.css'
import dogEar from './assets/dog-ear.svg'
import App from './App.tsx'

const GithubDogEar = () => {
 // const foldSize = 100;
  return (
    <>
     <div className="absolute bottom-0 right-0 z-50 w-24 md:w-36">
      <div className="relative w-full">
       <img src={dogEar} className="w-full" />
       <a href="https://github.com/ruxy1212/val-site/fork" target="_blank" className="absolute bottom-2 right-2">
        <Github size={24} />
       </a>
      </div>
     </div>
        <App />
    </>
  );
};

export default GithubDogEar;
