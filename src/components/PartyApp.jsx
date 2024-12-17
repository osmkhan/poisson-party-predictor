import React, { useState } from 'react';
import RealtimePoissonParty from './RealtimePoissonParty';

const LandingPage = ({ onEnter, show }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black text-white flex flex-col justify-center items-center text-center p-4
                  transition-all duration-500 ease-in-out
                  ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
    >
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-violet-400">
          Poisson Party Predictor
        </h1>
        
        <div className="text-lg mb-6">
          Hullo, welcome to a project for a very anxious friend of mine - you know who you are.
        </div>

        <div className="text-gray-400 mb-4 text-sm">
          Using Bayesian calculation and the Poisson distribution, see what the intro stats says about the state of your social circle!
        </div>

        <div className="text-gray-400 mb-8 text-sm italic">
          Perfect for answering the dark internal questions that occur in the moment before the bell rings.
        </div>

        <button
          onClick={onEnter}
          className="px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-lg"
        >
          Start Predicting
        </button>
      </div>
    </div>
  );
};

const PartyApp = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showPredictor, setShowPredictor] = useState(false);

  const handleEnter = () => {
    setShowLanding(false);
    setTimeout(() => setShowPredictor(true), 500);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <LandingPage onEnter={handleEnter} show={showLanding} />
      
      <div className={`transition-all duration-500 ease-in-out
                      ${showPredictor ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
        {showPredictor && <RealtimePoissonParty />}
      </div>
    </div>
  );
};

export default PartyApp;