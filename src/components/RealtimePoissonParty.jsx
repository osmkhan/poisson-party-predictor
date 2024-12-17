import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Clock, RefreshCw, XCircle, Flag } from 'lucide-react';

const RealtimePoissonParty = () => {
  const [expectedTotal, setExpectedTotal] = useState(20);
  const [partyDuration, setPartyDuration] = useState(180);
  const [arrivedGuests, setArrivedGuests] = useState([]);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isPartyStarted, setIsPartyStarted] = useState(false);

  const getStatusMessage = () => {
    if (!isPartyStarted) return null;
    
    const totalExpected = expectedTotal;
    const currentlyHere = arrivedGuests.length;
    const predictedMore = Math.round(getPredictedRemaining());
    const projectedTotal = currentlyHere + predictedMore;
    
    if (elapsedMinutes < 15) {
      return {
        message: "Party's just getting started! Give it some time... 🎈",
        color: "text-blue-400"
      };
    }

    const ratio = projectedTotal / totalExpected;

    if (ratio <= 0.5) {
      return {
        message: "Hey, it's okay! Some of the best parties are the intimate ones 💜",
        color: "text-indigo-400"
      };
    } else if (ratio <= 0.75) {
      return {
        message: "People are trickling in! The night is still young ✨",
        color: "text-violet-400"
      };
    } else if (ratio <= 0.9) {
      return {
        message: "Nice! The party's really picking up! 🎉",
        color: "text-fuchsia-400"
      };
    } else if (ratio <= 1.1) {
      return {
        message: "Perfect turnout! You nailed it! 🎯",
        color: "text-green-400"
      };
    } else if (ratio <= 1.5) {
      return {
        message: "Wow! More popular than expected! 🌟",
        color: "text-yellow-400"
      };
    } else {
      return {
        message: "This party is BLOWING UP! 🚀",
        color: "text-orange-400"
      };
    }
  };

  const resetParty = () => {
    setIsPartyStarted(false);
    setArrivedGuests([]);
    setElapsedMinutes(0);
  };

  const clearAll = () => {
    resetParty();
    setExpectedTotal(0);
    setPartyDuration(180);
  };

  const getRemainingMinutes = () => {
    return Math.max(0, partyDuration - elapsedMinutes);
  };

  const getCurrentRate = () => {
    if (elapsedMinutes === 0) return 0;
    return arrivedGuests.length / elapsedMinutes;
  };

  const getExpectedRate = () => {
    return expectedTotal / partyDuration;
  };

  const getPredictedRemaining = () => {
    const currentRate = getCurrentRate();
    const expectedRate = getExpectedRate();
    const blendFactor = Math.min(elapsedMinutes / 30, 1);
    const effectiveRate = (currentRate * blendFactor) + (expectedRate * (1 - blendFactor));
    const remainingTime = getRemainingMinutes();
    return effectiveRate * remainingTime;
  };

  const poissonPMF = (k, lambda) => {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / 
           (Array.from({length: k}, (_, i) => i + 1).reduce((a, b) => a * b, 1) || 1);
  };

  const getPredictionData = () => {
    const predictedRemaining = getPredictedRemaining();
    const maxK = Math.max(
      Math.ceil(predictedRemaining * 2),
      Math.ceil(expectedTotal * 1.5),
      arrivedGuests.length + 20
    );
    return Array.from({length: maxK + 1}, (_, k) => ({
      additional: k,
      total: k + arrivedGuests.length,
      probability: poissonPMF(k, predictedRemaining) * 100
    }));
  };

  const startParty = () => {
    setIsPartyStarted(true);
    setElapsedMinutes(0);
  };

  const addGuest = () => {
    setArrivedGuests(prev => [...prev, elapsedMinutes]);
  };

  const StatBox = ({ label, value, subtext, accent = "violet" }) => (
    <div className={`p-6 border border-gray-700 rounded-lg bg-gray-800/50 text-center`}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-5xl font-bold mb-2 text-${accent}-400`}>{value}</div>
      {subtext && <div className="text-sm text-gray-400">{subtext}</div>}
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto text-gray-100 bg-gray-900 rounded-xl">
      <div className="mb-6 space-y-4">
        {!isPartyStarted ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Total Guests
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={expectedTotal}
                onChange={(e) => setExpectedTotal(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter number of expected guests"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Party Duration (minutes): {partyDuration}
              </label>
              <input
                type="range"
                min="60"
                max="360"
                step="30"
                value={partyDuration}
                onChange={(e) => setPartyDuration(Number(e.target.value))}
                className="w-full bg-gray-700"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={startParty}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Start Party
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Clear All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {getStatusMessage() && (
              <div className={`flex items-center gap-2 p-4 rounded-lg bg-gray-800/50 border border-gray-700 ${getStatusMessage().color}`}>
                <Flag className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {getStatusMessage().message}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-violet-300">
                <Clock className="w-6 h-6" />
                <span className="text-lg">
                  <input 
                    type="number"
                    value={elapsedMinutes}
                    onChange={(e) => setElapsedMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-center"
                  /> minutes elapsed
                  {getRemainingMinutes() > 0 && ` (${getRemainingMinutes()} remaining)`}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Clear All"
                >
                  <XCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={resetParty}
                  className="p-2 text-violet-300 hover:text-violet-100 transition-colors"
                  title="Reset Party"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>
            <button
              onClick={addGuest}
              className="w-full px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-lg font-medium"
            >
              Guest Arrived! (+1)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border border-gray-700 rounded-lg p-4 bg-gray-800">
          <h3 className="text-lg font-medium mb-4 text-violet-300">Predicted Additional Arrivals</h3>
          <BarChart width={600} height={300} data={getPredictionData()}
                    style={{backgroundColor: '#1F2937'}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
            <XAxis dataKey="additional" stroke="#9CA3AF"/>
            <YAxis stroke="#9CA3AF"/>
            <Tooltip 
              contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}}
              labelStyle={{color: '#9CA3AF'}}
              itemStyle={{color: '#9CA3AF'}}
            />
            <Bar dataKey="probability" fill="#8B5CF6" />
          </BarChart>
        </div>

        <div className="space-y-4">
          <StatBox 
            label="Current Guests"
            value={arrivedGuests.length}
            subtext="People here now"
            accent="green"
          />
          <StatBox 
            label="Expected Total"
            value={expectedTotal}
            subtext="Original estimate"
            accent="blue"
          />
          <StatBox 
            label="Predicted More"
            value={Math.round(getPredictedRemaining())}
            subtext={`${getCurrentRate().toFixed(2)} guests/min`}
            accent="violet"
          />
        </div>
      </div>
    </div>
  );
};

export default RealtimePoissonParty;