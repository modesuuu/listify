'use client';
import React, { useState } from "react";
import useSWR, {mutate} from "swr";
import Delete from "../components/delete";
import ConfirmModal from "../components/confirm";
import api from "../utils/api";
import axios from "axios";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface Task {
    id: number;
    Title: string;
    Priority: string;
    Date: string;
    Time: string;
    category: {
        Name: string;
        Icon: string;
    };
    CompletedAt: string;
}

const DoneTasks: React.FC = () => {
  const { data: tasks, error } = useSWR<Task[]>("/api/tasks/done", fetcher);
  
  const [notification, setNotification] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Hilang otomatis
  };
  
  if (error) return <p>Error fetching tasks.</p>;
  if (!tasks) return <p>Loading...</p>;
  // move again
  const handleMoveToPending = async (taskId: number) => {
    try {
        await axios.put(`http://listify.rpl1.my.id/api/tasks/${taskId}/pending`);
        mutate("/api/tasks/done");
    } catch (error) {
        console.error("Error moving task back to pending:", error);
    }
  };

  // delete
  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await api.delete(`/api/tasks/${taskToDelete}`);
      mutate("/api/tasks/done");
      showNotification;
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setTaskToDelete(null); 
    }
  };

  return (
    <section className='pl-24 pt-6'>
      {notification && <Delete message={notification} />}
      {taskToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
      <div className="px-16 flex flex-col gap-4 ">
        <h1 className="text-2xl font-bold">Done Tasks</h1>
        {tasks.length === 0 ? (
          <p>No tasks completed yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className='flex bg-secondblue rounded-2xl items-center justify-between gap-16 pl-6'>
                <div className='flex gap-4 items-center w-auto'>
                    <div className='flex items-center p-2 rounded-xl bg-blue'>
                        <i className={`${task.category?.Icon} text-white text-2xl`}></i>
                    </div>
                    <div className='leading-[0.8] flex whitespace-nowrap flex-col'>
                        <h1 className='font-semibold text-base'>Completed at</h1>
                        <div className='text-sm flex gap-1 items-center text-greey2'>
                            <i className='bx bx-time-five text-base'></i>
                            <span>{new Date(task.CompletedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                        </div>
                    </div>
                </div>

                <div className='flex items-center bg-white rounded-r-2xl justify-between px-6 w-full py-3'>
                  <div className='flex flex-col gap-1'>
                    <h1 className='font-semibold leading-[0.8] text-lg'>{task.Title}</h1>
                    <div className='text-base flex gap-6 text-greey2'>
                      <div className='flex items-center gap-1'>
                          <i className='bx bx-calendar-alt'></i>
                          <span>{task.Date}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <i className='bx bxs-briefcase-alt-2'></i>
                        <span>{task.category?.Name}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <span>{task.Priority}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleMoveToPending(task.id)}>
                      <div className='bg-secondblue hover:bg-blue hover:text-secondblue transition-all rounded-lg text-blue items-center flex gap-0.5 py-2 pl-1.5 pr-3'>
                        <i className='bx bx-arrow-back text-2xl'></i>
                        <h1 className='text-base'>Back</h1>
                      </div>
                    </button>
                    <button onClick={()=> setTaskToDelete(task.id)} className='hover:bg-error active:hover:bg-error px-2 transition-all hover:text-white active:text-white rounded-lg flex items-center'>
                      <i className='bx bx-trash text-2xl'></i>
                    </button>
                  </div>
                </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DoneTasks;
