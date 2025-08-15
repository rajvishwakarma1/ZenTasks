import React, { useEffect, useState } from 'react';

const AnalogClock = ({ time, isStopwatch = false }) => {
  // For stopwatch, time is in centiseconds (1/100 of a second)
  // For normal clock, time is in seconds
  const [secondsAngle, setSecondsAngle] = useState(0);
  const [minutesAngle, setMinutesAngle] = useState(0);
  const [hoursAngle, setHoursAngle] = useState(0);

  useEffect(() => {
    let seconds, minutes, hours;
    
    if (isStopwatch) {
      seconds = (time % 6000) / 100;
      minutes = Math.floor(time / 6000) % 60;
      hours = Math.floor(time / 360000) % 12;
    } else {
      const date = new Date(time * 1000);
      seconds = date.getSeconds();
      minutes = date.getMinutes();
      hours = date.getHours() % 12;
    }

    setSecondsAngle(seconds * 6); // 6 degrees per second
    setMinutesAngle(minutes * 6 + (seconds / 10)); // 6 degrees per minute + slight movement based on seconds
    setHoursAngle(hours * 30 + (minutes / 2)); // 30 degrees per hour + slight movement based on minutes
  }, [time, isStopwatch]);

  return (
    <div className="relative w-48 h-48 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-600 shadow-md">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-4 bg-gray-800 dark:bg-gray-200"
            style={{
              transformOrigin: 'bottom center',
              transform: `translate(95px, 0) rotate(${i * 30}deg)`,
              left: '50%',
              top: '10px'
            }}
          />
        ))}
        
        {/* Minute markers */}
        {[...Array(60)].map((_, i) => (
          i % 5 !== 0 && (
            <div 
              key={i}
              className="absolute w-0.5 h-2 bg-gray-400 dark:bg-gray-500"
              style={{
                transformOrigin: 'bottom center',
                transform: `translate(95px, 0) rotate(${i * 6}deg)`,
                left: '50%',
                top: '10px'
              }}
            />
          )
        ))}
      </div>
      
      {/* Clock hands */}
      <div 
        className="absolute w-1 h-16 bg-gray-900 dark:bg-gray-100 rounded-full"
        style={{
          transformOrigin: 'bottom center',
          transform: `rotate(${hoursAngle}deg)`,
          bottom: '50%',
          left: '50%',
          marginLeft: '-0.5px'
        }}
      />
      <div 
        className="absolute w-1 h-20 bg-gray-800 dark:bg-gray-200 rounded-full"
        style={{
          transformOrigin: 'bottom center',
          transform: `rotate(${minutesAngle}deg)`,
          bottom: '50%',
          left: '50%',
          marginLeft: '-0.5px'
        }}
      />
      <div 
        className="absolute w-0.5 h-22 bg-red-500 rounded-full"
        style={{
          transformOrigin: 'bottom center',
          transform: `rotate(${secondsAngle}deg)`,
          bottom: '50%',
          left: '50%',
          marginLeft: '-0.25px'
        }}
      />
      
      {/* Center pin */}
      <div className="absolute w-3 h-3 bg-red-600 dark:bg-red-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default AnalogClock;