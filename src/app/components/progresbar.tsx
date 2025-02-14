import React, { JSX } from "react";

  export default function ProgressBar({ totalTasks, completedTasks }: { totalTasks: number; completedTasks: number }): JSX.Element {
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
    return (
        <div className="">
            <h1 className="font-medium text-lg text-black mb-3">Progress bar</h1>
           <div className="w-full bg-gray-300 rounded-full h-4">
                <div className="bg-blue h-4 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div> 
        </div>
    );
  };
  

  
