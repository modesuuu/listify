'use client'
import React, {useState, useEffect} from 'react'
import Task from '../../task/page'
import Addtask from '../../components/addtask'
import useSWR from "swr";
import { useParams } from 'next/navigation';
import api from '@/app/utils/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const Project = () => {

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false); 
  const [filter, setFilter] = useState('all');
  const params = useParams();
  const projectId = Number(params.id);
  const { data: project, error } = useSWR(`/api/projects/${projectId}`, fetcher);
  
  if (error) return <p className="text-red-500">Error fetching projects.</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <>
      <section className='pl-24 bg-white'>
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
              <h1 className='font-semibold text-4xl'>{project.name}</h1>
              <span className='font-medium text-sm text-greey2'>There's something to do today!</span>
            </div>
            {/* button */}
            <div className='relative flex items-center gap-3'>
              {/* filter */}
              <button className='text-darkblue active:bg-greey flex items-center py-2 px-3 border gap-3 border-greey2 rounded-xl'>
                <i className='bx bx-calendar-alt'></i>
                <select onChange={(e) => setFilter(e.target.value)} className='focus:outline-none cursor-pointer active:bg-greey text-darkblue w-full'>
                  <option value="">All</option>
                  <option value="">Low</option>
                  <option value="">Medium</option>
                  <option value="">High</option>
                  <option value="">Today</option>
                  <option value="">Tomorow</option>
                  <option value="">weekly</option>
                </select>
              </button>

              {/* new */}
              <button onClick={() => setIsAddTaskOpen(true)} className='text-white active:bg-[#6677B5] bg-blue rounded-xl flex items-center gap-2 py-2 px-3 ml-3'>
                <span>New Task</span>
                <i className='bx bx-plus'></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* task */}
      <section className=' relative pl-24'>
        {isAddTaskOpen && <Addtask idProject={projectId} onClose={() => setIsAddTaskOpen(false)} />}
      </section>
      <section className='pl-24 mt-6'>
        <Task projectID={null} />
      </section>
    </>
  )
}

export default Project