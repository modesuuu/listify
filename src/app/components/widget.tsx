import { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function Widget() {
  const [dateTime, setDateTime] = useState(DateTime.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl w-60">
      <div className="text-2xl font-semibold text-gray-800">
        <i className="bx bx-calendar"></i>
        {dateTime.toFormat("EEEE, dd LLLL yyyy")}
      </div>
    </div>
  );
}
