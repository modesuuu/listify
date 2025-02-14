'use client'
import Widget from './widget'
import { useState } from 'react'
import { DateTime } from "luxon";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import Addtask from './addtask';
import Tasktoday from './tasktoday';
import ProgressBar from './progresbar';
import api from '../utils/api';

type TaskType = {
  status: string;
  id: number;
  Title: string;
  Priority: string;
  Date: string; 
  Time: string;
  CategoryID: number;
  ProjectID: number;
  category: {
    Name: string;
    Icon: string;
  };
};
const fetcher = (url: string) => api.get(url).then((res) => res.data);


export default function Dashboard (){

  const { id } = useParams();
  const projectId = Number(id)

  const { data: task } = useSWR<TaskType[]>("/api/tasks",fetcher);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // today filter
  const today = DateTime.now().toFormat("yyyy-MM-dd");
  const todayTasks = task 
  ? task.filter((task) => task.Date.trim() === today.trim()) 
  : [];

  const totalTasks = task ? task.length : 0;
  const completedTasks: number = task ? task.filter((task: TaskType) => task.status === "done").length : 0;
  return (
    <>
    <section className='pl-24 bg-white mr-[439px]'>
      <div className='px-6 py-6 flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-base text-darkblue'>Project</h1>
          {/* search */}
          <div className='relative flex items-center justify-between px-3.5 py-2 bg-[#F3F5F9] rounded-xl'>
            <input type="text" className='focus:outline-none placeholder-blue bg-transparent rounded-lg p-2 ' placeholder='Search Project' />
            <i className='bx bx-search text-2xl text-greey2' ></i>
          </div>
        </div>
        {/* line */}
        <div className='w-full h-0.5 bg-greey2'></div>
        <div className='flex justify-between items-end'>
          {/* project name */}
          <div>
            <h1 className='font-semibold text-4xl'>Active Task</h1>
            <span className='font-medium text-sm text-greey2'>There's something to do today!</span>
          </div>
          {/* button */}
          <div className='relative flex items-center gap-3'>
            {/* filter */}
            <button className='text-darkblue active:bg-greey flex items-center py-2 px-3 border gap-3 border-greey2 rounded-xl'>
              <i className='bx bx-calendar-alt'></i>
              <select className='focus:outline-none cursor-pointer active:bg-greey text-darkblue w-full'>
                <option value="">All</option>
                <option value="">Low</option>
                <option value="">Medium</option>
                <option value="">High</option>
                <option value="">Today</option>
                <option value="">Tomorow</option>
                <option value="">weekly</option>
              </select>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className='mr-[439px] pl-24'>
      <div className='px-6 relative mt-6 flex items-center gap-6'>
        <div className=' px-6 py-3 w-64 bg-[#5151F9] rounded-3xl flex flex-col items-center '>
          <Image alt='' className=' w- ' src="/rocket1.png" width={120} height={120} />
          <div className='flex flex-col items-center gap-3 relative'>
            <h1 className='relative font-medium text-white text-center text-base '>Every great journey begins with a single step</h1>
            <p className='relative text-xs text-center'>Add your first milestone</p>
            <button onClick={() => setIsAddTaskOpen(true)} className='text-blue relative z-10 active:text-white transition-all hover:bg-slate-100 active:bg-blue bg-white rounded-xl flex items-center gap-2 py-2 px-3'>
              <i className='bx bx-plus'></i>
              <span>New Task</span>
            </button>
          </div>
        </div>
        {isAddTaskOpen && <Addtask idProject={projectId} onClose={() => setIsAddTaskOpen(false)} />}
        <div className='flex flex-col gap-6'>
          <Widget/>
          <div className='px-4 bg-white py-4 rounded-xl'>
            <ProgressBar totalTasks={totalTasks} completedTasks={completedTasks} />
            <p>
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          
        </div>
      </div>
    </section>

    <section className='mr-[439px] relative pl-24 mt-6 '>
      <div className='flex items-center justify-between px-6 mb-2'>
        <h1 className='text-2xl font-semibold'>Task</h1>
        <Link href={"/projects"}><span className='text-sm'>See all</span></Link>
      </div>
      {todayTasks.length === 0 ? (
          <p className='ml-6'>No tasks for today 🎉</p>
        ) : (
          <Tasktoday tasks={todayTasks} projectID={null} />
        )}
    </section>
    </>
  )
}
