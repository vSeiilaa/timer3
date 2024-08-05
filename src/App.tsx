import { useState, useEffect } from "react";
import { Timer, Settings } from "lucide-react";

interface PomodoroTimerProps {
  hourlyWage?: number;
}

const PomodoroTimer = ({ hourlyWage = 15 }: PomodoroTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hourlyWageState, setHourlyWageState] = useState(hourlyWage);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const moneyPerSecond = hourlyWageState / 3600;
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        setMoneyEarned((prevMoney) => prevMoney + moneyPerSecond);
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [isRunning, hourlyWageState]);

  const handleStartStop = () => {
    if (isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setSeconds(0);
    setMoneyEarned(0);
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <div className="absolute top-4 right-4">
        <Settings
          size={32}
          className="cursor-pointer"
          onClick={handleSettingsToggle}
        />
        {showSettings && (
          <div className="absolute top-10 right-0 bg-white p-6 rounded shadow-lg w-64">
            <label className="block mb-2 text-xl font-bold">Hourly Wage:</label>
            <input
              type="number"
              value={hourlyWageState}
              onChange={(e) => setHourlyWageState(Number(e.target.value))}
              className="text-xl font-bold w-full"
            />
          </div>
        )}
      </div>
      <Timer size={48} />
      <h1 className="text-4xl font-bold mb-4">Money Timer</h1>
      <p className="text-2xl font-bold mb-4">
        {Math.floor(seconds / 3600)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor(seconds % 60)
          .toString()
          .padStart(2, "0")}
      </p>
      <div className="flex flex-col items-start mb-4">
        <p className="text-2xl font-bold">Earned: ${moneyEarned.toFixed(2)}</p>
      </div>
      <div className="flex justify-center">
        <button
          className={`${
            isRunning
              ? "bg-yellow-500 hover:bg-yellow-700"
              : "bg-green-500 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={handleStartStop}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
