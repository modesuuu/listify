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
    <div className="">
        <div className="alert z-20 absolute alert-success flex items-center gap-4" role="alert">
            <span className="icon-[tabler--circle-check] size-6"></span>
            <p><span className="text-lg font-semibold">Success</span> {message}</p>
        </div>
    </div>
  );
};

export default Notif;