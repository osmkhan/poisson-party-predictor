import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Clock, RefreshCw, XCircle, Flag, UserPlus } from 'lucide-react';

const RealtimePoissonParty = () => {
  const [expectedTotal, setExpectedTotal] = useState(20);
  const [partyDuration, setPartyDuration] = useState(180);
  const [arrivedGuests, setArrivedGuests] = useState([]);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isPartyStarted, setIsPartyStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showGuestAdded, setShowGuestAdded] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempTimeInput, setTempTimeInput] = useState('');

  // Auto-increment time
  useEffect(() => {
    let timer;
    if (isPartyStarted && !isPaused) {
      timer = setInterval(() => {
        setElapsedMinutes(prev => {
          if (prev >= partyDuration) {
            clearInterval(timer);
            return prev;
          }
          return prev + (1/60); // Increment by 1 second
        });
      }, 1000); // Update every second
    }
    return () => clearInterval(timer);
  }, [isPartyStarted, isPaused, partyDuration]);

  // Guest added animation
  useEffect(() => {
    if (showGuestAdded) {
      const timer = setTimeout(() => setShowGuestAdded(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showGuestAdded]);

  const getStatusMessage = () => {
    if (!isPartyStarted) return null;
    
    const totalExpected = expectedTotal;
    const currentlyHere = arrivedGuests.length;
    const predictedMore = Math.round(getPredictedRemaining());
    const projectedTotal = currentlyHere + predictedMore;
    
    if (elapsedMinutes < 15) {
      return {
        message: "Just getting started. Give it a moment.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10"
      };
    }

    const ratio = projectedTotal / totalExpected;

    if (ratio <= 0.5) {
      return {
        message: "Small gatherings can be the most memorable.",
        color: "text-rose-400",
        bgColor: "bg-rose-500/10"
      };
    } else if (ratio <= 0.75) {
      return {
        message: "People are arriving steadily.",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10"
      };
    } else if (ratio <= 0.9) {
      return {
        message: "The party's gaining momentum.",
        color: "text-sky-400",
        bgColor: "bg-sky-500/10"
      };
    } else if (ratio <= 1.1) {
      return {
        message: "Perfect turnout, just as planned.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10"
      };
    } else if (ratio <= 1.5) {
      return {
        message: "More popular than expected.",
        color: "text-violet-400",
        bgColor: "bg-violet-500/10"
      };
    } else {
      return {
        message: "This is turning into quite the event.",
        color: "text-fuchsia-400",
        bgColor: "bg-fuchsia-500/10"
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

  const addGuests = (count) => {
    setArrivedGuests(prev => [...prev, ...Array(count).fill(elapsedMinutes)]);
    setShowGuestAdded(true);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const formatTime = (minutes) => {
    const totalSeconds = Math.floor(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeClick = () => {
    setIsEditingTime(true);
    setTempTimeInput(formatTime(elapsedMinutes));
  };

  const handleTimeChange = (e) => {
    setTempTimeInput(e.target.value);
  };

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = tempTimeInput.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes >= 0 && totalMinutes <= partyDuration) {
        setElapsedMinutes(totalMinutes);
      }
    }
    setIsEditingTime(false);
  };

  const handleTimeBlur = () => {
    setIsEditingTime(false);
  };

  const incrementMinutes = (amount) => {
    setElapsedMinutes(prev => {
      const newTime = prev + amount;
      return Math.max(0, Math.min(newTime, partyDuration));
    });
  };

  const StatBox = ({ label, value, subtext, accent = "violet" }) => (
    <div className={`p-6 border border-gray-700 rounded-lg bg-gray-800/50 text-center`}>
      <div className="text-lg font-medium text-gray-300 mb-2">{label}</div>
      <div className={`text-5xl font-bold mb-2 text-${accent}-400`}>{value}</div>
      {subtext && <div className="text-sm text-gray-400">{subtext}</div>}
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto text-gray-100 bg-gray-900 rounded-xl">
      <div className="mb-6 space-y-4">
        {!isPartyStarted ? (
          <div className="space-y-6">
            <div className="flex items-end gap-6">
              <div>
                <label className="block text-2xl font-medium mb-2 text-violet-300">
                  How many people are you expecting?
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={expectedTotal}
                  onChange={(e) => setExpectedTotal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-48 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-2xl text-center"
                  placeholder="Enter number"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={startParty}
                  className="px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-xl"
                >
                  Start Party
                </button>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-xl"
                >
                  <XCircle className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-2xl font-medium text-violet-300">
                  Party Duration
                </label>
                <span className="text-xl font-mono text-gray-300">
                  {formatTime(partyDuration)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="60"
                  max="360"
                  step="15"
                  value={partyDuration}
                  onChange={(e) => setPartyDuration(Number(e.target.value))}
                  className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h</span>
                <span>5h</span>
                <span>6h</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {getStatusMessage() && (
              <div className={`flex items-center gap-2 p-4 rounded-lg border border-gray-700 ${getStatusMessage().color} ${getStatusMessage().bgColor} transition-all duration-300`}>
                <Flag className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {getStatusMessage().message}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePause}
                  className={`p-2 rounded-full transition-colors ${isPaused ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  <Clock className="w-6 h-6" />
                </button>
                <div className="text-2xl font-mono">
                  {isEditingTime ? (
                    <form onSubmit={handleTimeSubmit} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempTimeInput}
                        onChange={handleTimeChange}
                        onBlur={handleTimeBlur}
                        className="w-32 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center font-mono"
                        placeholder="HH:MM:SS"
                        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                      />
                      <button
                        type="submit"
                        className="text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        ✓
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => incrementMinutes(-15)}
                        className="px-3 py-2 text-base bg-violet-500/20 text-violet-300 rounded hover:bg-violet-500/30 transition-colors"
                        title="Subtract 15 minutes"
                      >
                        -15 mins
                      </button>
                      <button
                        onClick={() => incrementMinutes(-1)}
                        className="px-3 py-2 text-base bg-violet-500/20 text-violet-300 rounded hover:bg-violet-500/30 transition-colors"
                        title="Subtract 1 minute"
                      >
                        -1 min
                      </button>
                      <span
                        onClick={handleTimeClick}
                        className="cursor-pointer hover:text-violet-300 transition-colors px-4"
                        title="Click to edit time"
                      >
                        {formatTime(elapsedMinutes)}
                      </span>
                      <button
                        onClick={() => incrementMinutes(1)}
                        className="px-3 py-2 text-base bg-violet-500/20 text-violet-300 rounded hover:bg-violet-500/30 transition-colors"
                        title="Add 1 minute"
                      >
                        +1 min
                      </button>
                      <button
                        onClick={() => incrementMinutes(15)}
                        className="px-3 py-2 text-base bg-violet-500/20 text-violet-300 rounded hover:bg-violet-500/30 transition-colors"
                        title="Add 15 minutes"
                      >
                        +15 mins
                      </button>
                    </div>
                  )}
                  <span className="text-sm text-gray-400 ml-2">
                    / {formatTime(partyDuration)}
                  </span>
                </div>
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

            <div className="flex justify-center gap-4">
              <button
                onClick={() => addGuests(5)}
                className={`px-6 py-3 bg-violet-600 text-white rounded-lg transition-all duration-300 text-lg font-medium flex items-center justify-center gap-2 hover:bg-violet-700 min-w-[160px]`}
              >
                <UserPlus className="w-5 h-5" />
                +5 Guests
              </button>
              <button
                onClick={() => addGuests(1)}
                className={`px-6 py-3 bg-violet-600 text-white rounded-lg transition-all duration-300 text-lg font-medium flex items-center justify-center gap-2 hover:bg-violet-700 min-w-[160px]`}
              >
                <UserPlus className="w-5 h-5" />
                +1 Guest
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border border-gray-700 rounded-lg p-4 bg-gray-800">
          <h3 className="text-lg font-medium mb-4 text-violet-300">Predicted Additional Arrivals</h3>
          <BarChart width={600} height={300} data={getPredictionData()}
                    style={{backgroundColor: '#1F2937'}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
            <XAxis dataKey="additional" stroke="#9CA3AF">
              <text
                x={300}
                y={295}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="16"
                fontWeight="bold"
              >
                Additional Arrivals (k)
              </text>
            </XAxis>
            <YAxis stroke="#9CA3AF">
              <text
                x={-150}
                y={15}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="16"
                fontWeight="bold"
              >
                Probability (%)
              </text>
            </YAxis>
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
            label="Current Attendance"
            value={arrivedGuests.length}
            subtext="Guests who have arrived"
            accent="emerald"
          />
          <StatBox 
            label="Expected Attendance"
            value={expectedTotal}
            subtext="Total guests invited"
            accent="sky"
          />
          <StatBox 
            label="Expected Additional"
            value={Math.round(getPredictedRemaining())}
            subtext={`Arrival rate: ${getCurrentRate().toFixed(2)} per minute`}
            accent="violet"
          />
        </div>
      </div>
    </div>
  );
};

export default RealtimePoissonParty;