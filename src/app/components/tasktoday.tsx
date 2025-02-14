'use client';
import React,{ useState } from 'react';

import  { mutate } from "swr";

import Notif from '../components/notif';

import ConfirmModal from '../components/confirm';
import api from '../utils/api';

    const fetcher = (url: string) => api.get(url).then((res) => res.data);

    enum Priority {
        Low = "low",
        Medium = "medium",
        High = "high",
    }
    interface Task {
        id: number;
        Title: string;
        Priority: Priority;
        Date: string;
        Time: string;
        category:{
            Name: string;
            Icon: string;
        };
    }

    type TaskType = {
        id: number;
        Title: string;
        Priority: string;
        Date: string;
        Time: string;
        CategoryID: number;
        ProjectID: number | null;
        category: {
        Name: string;
        Icon: string;
        };
    };
    
    interface TaskProps {
        tasks: TaskType[]; 
        filter?: string;
        projectID: number | null; 
    }
    

    const Tasktoday: React.FC<TaskProps> = ({ tasks, filter, projectID }) => {  

        const [notification, setNotification] = useState<string | null>(null);
        const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

        const showNotification = (message: string) => {
            setNotification(message);
            setTimeout(() => setNotification(null), 3000);
          };

        // delete
        const handleDelete = async () => {
            if (!taskToDelete) return;
            try {
                await api.delete(`/api/tasks/${taskToDelete}`);
                mutate("/api/tasks")
            } catch (error) {
                console.error("Failed to delete task:", error);
            }finally {
                setTaskToDelete(null); 
            }
        };
        // done
        const handleDone = async (taskId: number) => {
            console.log("Task ID:", taskId);
            try {
                await api.patch(`/api/tasks/${taskId}/done`, fetcher);
                mutate(`/api/tasks/project/${projectID}`);
                showNotification("Task successfully marked as done! ✅");
            } catch (error) {
                console.error("Failed to mark task as done:", error);
                showNotification("Failed to mark task as done! ❌");
            }
        };

    return (
        <>
        {taskToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
        {notification && <Notif message={notification} onClose={() => setNotification(null)} />}
        <section className='px-6 flex flex-col gap-4'>
                {[...tasks].sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.Priority as Priority] - priorityOrder[a.Priority as Priority];
                }).map((Tasks) => (       
                    <div key={Tasks.id} className='flex bg-secondblue rounded-2xl items-center justify-between gap-16 pl-6'>
                        {/* Start */}
                        <div className='flex gap-4 items-center w-auto'>
                            <div className='flex items-center p-2 rounded-xl bg-blue'><i className={`${Tasks.category.Icon} text-white text-2xl`}></i></div>
                            <div className='leading-[0.8] flex whitespace-nowrap flex-col'>
                                <h1 className='font-semibold text-base '>Start from</h1>
                                <div className='text-sm flex gap-1 items-center text-greey2'>
                                    <i className='bx bx-time-five text-base' ></i>
                                    <span>{new Date(`1970-01-01T${Tasks.Time}`).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className='flex items-center bg-white rounded-r-2xl justify-between px-6 w-full py-3'>
                            {/* title */}
                            <div className=' flex flex-col gap-1'>
                                <h1 className='font-semibold leading-[0.8] text-lg'>{Tasks.Title}</h1>
                                <div className='text-base flex gap-6 text-greey2'>
                                    <div className='flex items-center gap-1'>
                                        <i className='bx bx-calendar-alt' ></i>
                                        <span>{Tasks.Date}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <i className={`${Tasks.category.Icon}`}></i>
                                        <span>{Tasks.category.Name}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <span>{Tasks.Priority}</span>
                                    </div>
                                </div>
                            </div>

                            {/* button */}
                            <div className='flex gap-3.5'>
                                <button onClick={() => handleDone(Tasks.id)}>
                                    <div className='bg-secondblue hover:bg-blue hover:text-secondblue transition-all rounded-lg text-blue items-center flex gap-0.5 py-2 pl-1.5 pr-3'>
                                        <i className='bx bx-stopwatch text-2xl'></i>
                                        <h1 className='text-base'>Done</h1>
                                    </div>
                                </button>

                                {/* delete */}
                                <button onClick={()=> setTaskToDelete(Tasks.id)} className='hover:bg-error active:hover:bg-error px-2 transition-all hover:text-white active:text-white rounded-lg flex items-center'>
                                    <i className='bx bx-trash text-2xl'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

        </section>
        </>
    )
    }
    export default Tasktoday