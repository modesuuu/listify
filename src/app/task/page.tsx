'use client';
import React,{ useState } from 'react';
import useSWR, { mutate } from "swr";
import Notif from '../components/notif';
import api from "../utils/api";
import ConfirmModal from '../components/confirm';
import { DateTime } from 'luxon';

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
    Date: string ;
    Time: string;
    CategoryID: number;
    category:{
        Name: string;
        Icon: string;
    };
}

interface Category {
    CategoryID: number;
    Name: string;
    Icon: string;
}

type TaskType = {
    id: number;
    Title: string;
    Priority: Priority;
    Date: string;
    Time: string;
    CategoryID: number;
    ProjectID: number | null;
    category: {
    Name: string;
    Icon: string;
    };};
    
interface TaskProps {
    projectID: number | null; 
}
    
    const Task: React.FC<TaskProps> = ({ projectID }) => {  

        const { data: task, error } = useSWR<TaskType[]>(`/api/tasks/project/${projectID}`, fetcher);
        const { data: categories } = useSWR<Category[]>("/api/categories", fetcher);
        mutate(`/api/tasks/project/${projectID}`);
        
        const [notification, setNotification] = useState<string | null>(null);
        const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
        const [editTask, setEditTask] = useState<Task | null>(null);
        const [isModalOpen, setIsModalOpen] = useState<number | null>(null);
        
        
        if (error) return <p>Error fetching tasks.</p>;
        if (!task) return <p>Loading...</p>;

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
            console.log("task",taskId)
            try {
                 await api.patch(`/api/tasks/${taskId}/done`);
                 showNotification("Task successfully marked as done! ✅");
                } catch (error) {
                    console.error("Failed to mark task as done:", error);
                    showNotification("Failed to mark task as done! ❌");
                }
        };
        
        // update
        const updateTask = async (id: number, updatedTask: Task) => {
            try {
              await api.put(`/api/tasks/${id}`, updatedTask);
              mutate(`/api/tasks/project/${projectID}`);
              setEditTask(null)
              showNotification("Task updated successfully! ✅");
            } catch (error: any) {
                console.error("Error updating task:", error.response?.data);
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
        {/* edit modal */}
        {editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white flex flex-col gap-3 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

            <input
                name="Title"
                className="focus:outline-none border-b-2 p-1 w-full bg-transparent"
                onChange={(e) => setEditTask({ ...editTask, Title: e.target.value })}
                type="text"
                placeholder="New Project"
                value={editTask.Title}
                required
            />

            <input
                type="date"
                value={editTask.Date}
                onChange={(e) => setEditTask({ ...editTask, Date: e.target.value })}
                className="w-full p-2 border rounded-md mb-3"
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="">Priority</label>
                <div className="join drop-shadow gap-0 justify-between">
                  <input className="join-item btn" type="radio" name="Priority" aria-label="Low" onChange={(e) => setEditTask({ ...editTask, Priority: e.target.value as Priority})} checked={editTask.Priority === Priority.Low} value="low" />
                  <input className="join-item btn" type="radio" name="Priority" aria-label="Medium" onChange={(e) => setEditTask({ ...editTask, Priority: e.target.value as Priority})} checked={editTask.Priority === Priority.Medium} value="medium" />
                  <input className="join-item btn" type="radio" name="Priority" aria-label="High" onChange={(e) => setEditTask({ ...editTask, Priority: e.target.value as Priority})} checked={editTask.Priority === Priority.High} value="high" />
                </div>
            </div>

            <div className="relative mt-2">
                <select onChange={(e) => setEditTask({ ...editTask, CategoryID: parseInt(e.target.value) })}  value={editTask.CategoryID} className="select select-floating max-w-sm" aria-label="Select floating label" id="selectFloating">
                  {categories?.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>{category.Name}</option>
                  ))}
                </select>
                <label className="select-floating-label" htmlFor="selectFloating">Categories</label>
              </div>

            {/* <select
                value={editTask.Priority}
                onChange={(e) => setEditTask({ ...editTask, Priority: e.target.value as Priority })}
                className="w-full p-2 border rounded-md mb-3"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select> */}


            <input
                type="time"
                value={editTask.Time}
                onChange={(e) => setEditTask({ ...editTask, Time: e.target.value })}
                className="w-full p-2 border rounded-md mb-3"
            />

            <div className="flex justify-end gap-3">
                <button onClick={() => setEditTask(null)} className="btn btn-outline btn-error">Cancel</button>
                <button onClick={() => updateTask(editTask.id, editTask)} className="btn bg-blue text-white hover:text-black rounded-md hover:bg-secondblue">Save</button>
            </div>
            </div>
        </div>
        )}

        {notification && <Notif message={notification} onClose={() => setNotification(null)} />}
        <section className='px-6 flex flex-col gap-4'>
                {[...task].sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.Priority as Priority] - priorityOrder[a.Priority as Priority];
                }).map((Tasks) => (       
                    <div key={Tasks.id} className='flex bg-secondblue rounded-2xl items-center justify-between gap-3 lg:gap-16 lg:pl-6 pl-3'>
                        {/* Start */}
                        <div className='flex gap-4 items-center w-auto'>
                            <div className='flex items-center p-2 rounded-xl bg-blue'><i className={`${Tasks.category.Icon} text-white text-2xl`}></i></div>
                            <div className='leading-[0.8] lg:flex whitespace-nowrap hidden lg:flex-col'>
                                <h1 className='font-semibold text-base '>Start from</h1>
                                <div className='text-sm flex gap-1 items-center text-greey2'>
                                    <i className='bx bx-time-five text-base' ></i>
                                    <span>{new Date(`1970-01-01T${Tasks.Time}`).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className='flex items-center bg-white rounded-r-2xl justify-between px-4 w-full py-3'>
                            {/* title */}
                            <div className='flex flex-col gap-1'>
                                <h1 className='font-semibold leading-[0.8] text-lg'>{Tasks.Title}</h1>
                                <div className='text-base flex gap-6 text-greey2'>
                                    <div className='flex items-center gap-1'>
                                        <i className='bx bx-calendar-alt' ></i>
                                        <span className='lg:hidden'>{DateTime.fromISO(Tasks.Date).toFormat("dd MMM")}</span>
                                        <span className='hidden lg:block'>{DateTime.fromISO(Tasks.Date).toFormat("dd MMM yyyy")}</span>    
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
                            <div className='flex relative gap-3.5'>
                                <div className='lg:flex gap-3.5 hidden'>
                                    <button onClick={() => handleDone(Tasks.id)}>
                                        <div className='bg-secondblue hover:bg-blue hover:text-secondblue transition-all rounded-lg text-blue items-center flex gap-0.5 py-2 pl-1.5 pr-3'>
                                            <i className='bx bx-stopwatch text-2xl'></i>
                                            <h1 className='text-base'>Done</h1>
                                        </div>
                                    </button>

                                    {/* delete */}
                                    <div className='flex gap-1'>
                                        <button onClick={()=> setTaskToDelete(Tasks.id)} className='hover:bg-error active:hover:bg-error px-2 transition-all hover:text-white active:text-white rounded-lg flex items-center'>
                                            <i className='bx bx-trash text-2xl'></i>
                                        </button>
                                        {/* edit */}
                                        <button className="rounded-lg flex items-center hover:bg-blue hover:text-white px-2 py-2 transition-all" onClick={() => setEditTask(Tasks)}>
                                            <i className='bx text-2xl bxs-edit'></i>
                                        </button>
                                    </div>
                                </div>
                                <button className="rounded-lg lg:hidden flex items-center hover:bg-blue hover:text-white px-2 py-2 transition-all" onClick={() => setIsModalOpen(Tasks.id)}>
                                    <i className='bx text-2xl bxs-edit'></i>
                                </button>
                                {isModalOpen === Tasks.id && 
                                <div className='flex px-3 py-3 rounded-lg flex-col bg-white gap-3.5 absolute translate-y-1/2 -translate-x-1/2 bottom-0'>
                                <button onClick={() => setIsModalOpen(null)} className="flex justify-end items-end"><i className='right-0'>x</i></button>
                                <div>
                                    <button onClick={() => handleDone(Tasks.id)}>
                                        <div className='bg-secondblue hover:bg-blue hover:text-secondblue transition-all rounded-lg text-blue items-center flex gap-0.5 py-2 pl-1.5 pr-3'>
                                            <i className='bx bx-stopwatch text-2xl'></i>
                                            <h1 className='text-base'>Done</h1>
                                        </div>
                                    </button>

                                    {/* delete */}
                                    <div className='flex gap-1'>
                                        <button onClick={()=> setTaskToDelete(Tasks.id)} className='hover:bg-error active:hover:bg-error px-2 transition-all hover:text-white active:text-white rounded-lg flex items-center'>
                                            <i className='bx bx-trash text-2xl'></i>
                                        </button>
                                        {/* edit */}
                                        <button className="rounded-lg flex items-center hover:bg-blue hover:text-white px-2 py-2 transition-all" onClick={() => setEditTask(Tasks)}>
                                            <i className='bx text-2xl bxs-edit'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                }
                            </div>
                        </div>
                    </div>
                ))}
        </section>
        </>
    )
    }
    export default Task