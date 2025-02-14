"use client";
import React, { useEffect } from "react";

interface notifProps {
  message: string;
  onClose: () => void;
}

const Notif: React.FC<notifProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); 
        return () => clearTimeout(timer);
      });
  return (
    <div className="absolute pl-24 pr-[439px] top-0 mt-3 flex items-center justify-center w-full">
        <div className="alert z-20 w-fit alert-success flex items-center gap-4" role="alert">
            <span className="icon-[tabler--circle-check] size-6"></span>
            <p><span className="text-lg font-semibold">Success</span> {message}</p>
            <button
          onClick={onClose}
          className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        </div>
    </div>
  );
};

export default Notif;