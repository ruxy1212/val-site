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
       <button className="absolute top-2 right-2">
        <Github size={20} />
       </button>
      </div>
     </div>
        <App />
    </>
  );
};

export default GithubDogEar;
