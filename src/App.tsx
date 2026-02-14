import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartCrack, Stars, Sparkles, RefreshCw, Lock, MessageCircleHeart } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// --- Feedback Messages ---
const FEEDBACKS = {
  2: [ // Amazing check
    "Are you sure?", 
    "Look in the mirror!", 
    "Don't be shy!", 
    "You really are!", 
    "Just admit it! 😉"
  ],
  3: [ // Secret
    "It's a good secret!", 
    "Don't be scared!", 
    "Trust me!", 
    "I promise it's safe", 
    "Pretty please? 🥺"
  ],
  4: [ // Promise
    "Cross your heart!", 
    "I need that smile!", 
    "Don't say maybe...", 
    "Pinky promise?", 
    "Please promise me! ❤️"
  ],
  5: [// Say yes
    "Are you sure?",
    "Why did you hesitate?",
    "Youre not smiling 😢",
    "For real? Please say it again 😆",
    "You partially touched No"
  ]
};

// --- Assets & Helpers ---

const triggerConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff0000', '#ff69b4', '#ffffff']
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff0000', '#ff69b4', '#ffffff']
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

const triggerSadConfetti = () => {
  const scalar = 3;
  const crying = confetti.shapeFromText({ text: '😢', scalar });
  const broken = confetti.shapeFromText({ text: '💔', scalar });
  const shoot = () => {
    confetti({
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: [crying, broken],
      scalar
    });
  };
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

// --- Components ---

const Toast = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.8 }}
    className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
  >
    <div className="bg-white/90 backdrop-blur-md text-pink-600 px-6 py-3 rounded-full shadow-2xl border border-pink-100 flex items-center gap-2 font-bold text-lg">
      <MessageCircleHeart size={20} className="fill-pink-200" />
      {message}
    </div>
  </motion.div>
);

const Balloon = ({ delay, speed, color, size, left }: { delay: number, speed: number, color: string, size: number, left: string }) => {
  return (
    <motion.div
      className="absolute bottom-[-150px] z-0 opacity-60 pointer-events-none"
      style={{ left: left }}
      animate={{
        y: -1200,
        x: [0, 30, -30, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, ease: "linear", delay: delay },
        x: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
      }}
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none">
        <path d="M50 118L48 100C48 100 2 80 2 50C2 23.4903 23.4903 2 50 2C76.5097 2 98 23.4903 98 50C98 80 52 100 52 100L50 118Z" fill={color} />
        <ellipse cx="30" cy="30" rx="10" ry="20" transform="rotate(-30 30 30)" fill="white" fillOpacity="0.4" />
        <path d="M50 118C50 118 45 130 55 140" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    </motion.div>
  );
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, y: 50 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`relative z-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 max-w-md w-full mx-4 text-center overflow-hidden ${className}`}
  >
    <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none" />
    {children}
  </motion.div>
);

// --- Gemini API ---
const generatePoem = async (apiKey: string) => {
  if (!apiKey) return "";
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Write a very short, sweet, whimsical 4-line poem about eternal love and finding your soulmate. Do not use markdown." }] }]
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (e) {
    return "Roses are red, violets are blue, even offline, my heart chooses you.";
  }
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [badBtnState, setBadBtnState] = useState({ scale: 1, x: 0, y: 0 });
  const [yesBtnState, setYesBtnState] = useState({ scale: 1, x: 0, y: 0, clicks: 0 });
  const [toastMessage, setToastMessage] = useState("");
  const [poem, setPoem] = useState<string>("");
  const [loadingPoem, setLoadingPoem] = useState(false);
  const apiKey = ""; // API Key handled by environment

  // Reset states when changing steps
  useEffect(() => {
    setBadBtnState({ scale: 1, x: 0, y: 0 });
    setYesBtnState({ scale: 1, x: 0, y: 0, clicks: 0 });
    setToastMessage("");
  }, [step]);

  // Handle Toast Feedback logic
  const showRandomFeedback = (stepNum: 2 | 3 | 4 | 5) => {
    const messages = FEEDBACKS[stepNum];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setToastMessage(randomMsg);
    // Clear toast after 2 seconds
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Steps 2, 3, 4: The "Bad" button shrinks and jumps
  const handleBadInteraction = (currentStep: 2 | 3 | 4) => {
    showRandomFeedback(currentStep);
    const newScale = Math.max(0.6, badBtnState.scale - 0.15);
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 150;
    setBadBtnState({ scale: newScale, x: randomX, y: randomY });
  };

  // Step 5: The "No" button resets everything
  const handleNoButton = () => {
    setToastMessage("I don't blame you 😢");
    triggerSadConfetti();
    setTimeout(() => {
      setStep(7);
    }, 2500);
  };

  // Step 5: The "Yes" button is hard to get
  const handleYesButton = () => {
    // Requires random clicks (between 3 and 6)
    const requiredClicks = 3 + (Math.random() * 5);
    showRandomFeedback(5);
    if (yesBtnState.clicks >= requiredClicks) {
      setStep(6);
      triggerConfetti();
    } else {
      const newScale = Math.max(0.6, yesBtnState.scale - 0.05);
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 200;
      setYesBtnState({
        scale: newScale,
        x: randomX,
        y: randomY,
        clicks: yesBtnState.clicks + 1
      });
    }
  };

  // Step 7: The "Change mind" button resets everything
  const handleChangeButton = () => {
    setToastMessage("Ahah! thank youuuuuu 😘");
    setTimeout(() => {
      setStep(1);
    }, 2500);
  };

  const fetchPoem = async () => {
    setLoadingPoem(true);
    const text = await generatePoem(apiKey);
    setPoem(text || "You are my sunshine, my only sunshine. You make me happy when skies are grey.");
    setLoadingPoem(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center font-sans text-white selection:bg-pink-500 selection:text-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && <Toast key="toast" message={toastMessage} />}
      </AnimatePresence>

      {/* Background Balloons */}
      <Balloon delay={0} speed={15} color="#FF69B4" size={80} left="10%" />
      <Balloon delay={2} speed={18} color="#FF1493" size={100} left="25%" />
      <Balloon delay={5} speed={20} color="#9400D3" size={60} left="60%" />
      <Balloon delay={1} speed={22} color="#FF0000" size={90} left="80%" />
      <Balloon delay={4} speed={17} color="#DA70D6" size={70} left="40%" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Intro */}
        {step === 1 && (
          <GlassCard key="step1">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <Heart className="w-20 h-20 text-red-500 fill-red-500 mx-auto mb-6 drop-shadow-lg animate-pulse" />
            </motion.div>
            <h1 className="text-5xl font-extrabold mb-4 font-[serif] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white">
              I Love You
            </h1>
            <p className="text-lg text-pink-100 mb-8 font-light italic opacity-90">
              Every heartbeat, every thought… somehow they all lead back to you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Open Your Surprise <Stars size={18} />
            </motion.button>
          </GlassCard>
        )}

        {/* STEP 2: Amazing Check */}
        {step === 2 && (
          <GlassCard key="step2">
             <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4 text-4xl">🤔</motion.div>
            <h2 className="text-3xl font-bold mb-8">Wait a minute.. Do you know how amazing you are?</h2>
            <div className="flex flex-col gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                className="bg-green-500/80 hover:bg-green-500 text-white w-64 py-3 rounded-xl font-bold shadow-lg backdrop-blur-sm border border-white/20 transition-all"
              >
                Yes, I do!
              </motion.button>
              
              <motion.button
                animate={{ scale: badBtnState.scale, x: badBtnState.x, y: badBtnState.y }}
                onClick={() => handleBadInteraction(2)}
                className="bg-white/20 hover:bg-white/30 text-white w-64 py-3 rounded-xl font-medium backdrop-blur-sm border border-white/10"
              >
                Hmm Maybe...
              </motion.button>
            </div>
          </GlassCard>
        )}

        {/* STEP 3: Secret */}
        {step === 3 && (
          <GlassCard key="step3">
            <Lock className="w-12 h-12 mx-auto mb-4 text-pink-300" />
            <h2 className="text-3xl font-bold mb-8">Can I tell you a secret? 🤫</h2>
            <div className="flex flex-col gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(4)}
                className="bg-pink-500/80 hover:bg-pink-500 text-white w-64 py-3 rounded-xl font-bold shadow-lg backdrop-blur-sm border border-white/20 transition-all"
              >
                Yes, please!
              </motion.button>
              
              <motion.button
                animate={{ scale: badBtnState.scale, x: badBtnState.x, y: badBtnState.y }}
                onClick={() => handleBadInteraction(3)}
                className="bg-white/20 hover:bg-white/30 text-white w-64 py-3 rounded-xl font-medium backdrop-blur-sm border border-white/10"
              >
                I'm scared...
              </motion.button>
            </div>
          </GlassCard>
        )}

        {/* STEP 4: Promise */}
        {step === 4 && (
          <GlassCard key="step4">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-8">Do you promise to smile?</h2>
            <div className="flex flex-col gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(5)}
                className="bg-blue-500/80 hover:bg-blue-500 text-white w-64 py-3 rounded-xl font-bold shadow-lg backdrop-blur-sm border border-white/20 transition-all"
              >
                I Promise 🤞
              </motion.button>
              
              <motion.button
                animate={{ scale: badBtnState.scale, x: badBtnState.x, y: badBtnState.y }}
                onClick={() => handleBadInteraction(4)}
                className="bg-white/20 hover:bg-white/30 text-white w-64 py-3 rounded-xl font-medium backdrop-blur-sm border border-white/10"
              >
                Hmm maybe...
              </motion.button>
            </div>
          </GlassCard>
        )}

        {/* STEP 5: Valentine Request */}
        {step === 5 && (
          <GlassCard key="step5">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-4xl font-extrabold mb-8 font-[serif]">Will you be my Valentine?</h2>
            
            <div className="h-48 relative w-full flex justify-center items-center">
              {/* YES Button (Hard to get) */}
              <motion.button
                animate={{ scale: yesBtnState.scale, x: yesBtnState.x, y: yesBtnState.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={handleYesButton}
                className="absolute z-20 bg-gradient-to-r from-pink-500 to-red-500 text-white w-32 py-3 rounded-full font-bold shadow-xl border-2 border-white/50"
              >
                 Yes!
              </motion.button>

              {/* NO Button (Triggers Sad Reset) */}
              <motion.button
                whileHover={{ scale: 0.95 }}
                onClick={handleNoButton}
                className="absolute z-10 top-24 bg-gray-800/50 hover:bg-gray-800/80 text-gray-300 w-32 py-2 rounded-full backdrop-blur-md border border-white/10"
              >
                No
              </motion.button>
            </div>
          </GlassCard>
        )}

        {/* STEP 6: Finale */}
        {step === 6 && (
          <GlassCard key="step6" className="max-w-xl">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Heart className="w-24 h-24 text-pink-400 stroke-2 opacity-50" />
                  </motion.div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-[serif] text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200">
                My Heart Chooses You
              </h1>
              
              <p className="text-xl text-pink-100 mb-6 font-light leading-relaxed">
                Loving you feels natural like breathing, like home, like forever.
              </p>
              
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8 backdrop-blur-md">
                <p className="font-[serif] text-2xl italic text-white/90">
                  "If love had a name, it would sound exactly like yours."
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                 {!poem && !loadingPoem && (
                   <button 
                    onClick={fetchPoem}
                    className="text-sm flex items-center justify-center gap-2 mx-auto text-pink-200 hover:text-white transition-colors"
                   >
                     <Sparkles size={16} /> Ask AI to write us a poem
                   </button>
                 )}
                 {loadingPoem && (
                    <div className="flex items-center justify-center gap-2 text-pink-200">
                      <RefreshCw className="animate-spin" size={16} /> Writing...
                    </div>
                 )}
                 {poem && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-pink-900/30 p-4 rounded-xl mt-2 border border-pink-500/20">
                     <p className="text-pink-100 font-serif italic text-lg leading-relaxed">{poem}</p>
                   </motion.div>
                 )}
              </div>

              <div className="mt-8 text-xs text-white/50 tracking-widest uppercase">Forever & Always</div>
            </motion.div>
          </GlassCard>
        )}

        {/* STEP 7: Valentine decline */}
        {step === 7 && (
          <GlassCard key="step7">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <HeartCrack className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-8 font-[serif]">Oga na, e go dey be ✌️</h2>
            
            <div className="h-48 relative w-full flex justify-center items-center">
              {/* NO Button (Triggers Sad Reset) */}
              <motion.button
                whileHover={{ scale: 0.95 }}
                onClick={handleChangeButton}
                className="absolute z-10 top-24 bg-gray-800/50 hover:bg-gray-800/80 text-gray-300 w-32 py-2 rounded-full backdrop-blur-md border border-white/10"
              >
                Change Mind
              </motion.button>
            </div>
          </GlassCard>
        )}

      </AnimatePresence>
    </div>
  );
}
