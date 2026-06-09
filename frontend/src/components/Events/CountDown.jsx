import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`);
    }
    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  if (!Object.keys(timeLeft).length) {
    return (
      <div className="flex items-center justify-center p-3 bg-red-500/10 rounded-lg">
        <span className="text-red-500 font-medium">Time's Up</span>
      </div>
    );
  }

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 min-w-[90px] relative">
        <span className="text-2xl font-bold text-yellow-500 block text-center">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-gray-400 mt-2 font-medium tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="inline-flex gap-2
    ">
      {/* Days */}
      {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="DAYS" />}

      {/* Hours */}
      <TimeUnit value={timeLeft.hours} label="HOURS" />

      {/* Minutes */}
      <TimeUnit value={timeLeft.minutes} label="MINUTES" />

      {/* Seconds */}
      <TimeUnit value={timeLeft.seconds} label="SECONDS" />
    </div>
  );
};

export default CountDown;