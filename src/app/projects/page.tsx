'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import Addproject from "../components/addproject";
import { useParams } from "next/navigation";
import Side from "../components/side";
import ConfirmModal from "../components/confirm";
import api from "../utils/api";
import axios from "axios";

type Project = {
  [x: string]: any;
  id: number;
  name: string;
  tasks: Task[];
};

type Task = {
  id: number;
  name: string;
  Priority: string;
  Date: string;
  Time: string;
  CategoryID: number;
  ProjectID: number;
};

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); 
  const { id } = useParams(); 
  const projectId = Number(id); 

  useEffect(() => {
    api
      .get("/api/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));  
  }, [projectId]);

  // delete
  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`http://listify.rpl1.my.id/api/projects/${taskToDelete}`);
      mutate("/api/projects")
    } catch (error) {
      console.error("Failed to delete task:", error);
    }finally {
      setTaskToDelete(null); 
    }
};

  return (
    <>
    <Side/>
    {taskToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this project?"
          onConfirm={handleDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
      <section className='pl-24 bg-white mr-[439px]'>
        <div className='px-6 py-6 flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h1 className='font-semibold text-base text-darkblue'>Projects</h1>
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
              <h1 className='font-semibold text-4xl'>Projects</h1>
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

              {/* new */}
              <button onClick={()=>setShowForm(true)} className='text-white active:bg-[#6677B5] bg-blue rounded-xl flex items-center gap-2 py-2 px-3 ml-3'>
                <span>New project</span>
                <i className='bx bx-plus'></i>
              </button>
            </div>
          </div>
        </div>
      </section>            

    <div className="pl-24 mr-[439px] relative">
    {showForm && <Addproject onClose={()=>setShowForm(false)}/>}
      <div className=" flex flex-col px-4 gap-3">
        <h1 className="font-semibold text-2xl mt-6">Project List</h1>
        {projects && projects.map((project:{id: number, name: string}) => (
          <div key={project.id}>
              <div className='flex bg-secondblue rounded-2xl items-center justify-between gap-16 pl-6'>
              {/* Start */}
            <Link className="flex bg-secondblue w-1/2 rounded-2xl items-center justify-between gap-16 pl-6" href={`/projects/${project.id}`}>
              <div className='flex gap-4 items-center w-1/4'>
                  <div className='flex items-center p-2 rounded-xl bg-blue'><i className='bx bx-list-ul text-2xl'></i></div>
                  <div className='leading-[0.8] flex whitespace-nowrap flex-col'>
                    <h1 className='font-semibold text-base '>{project.name}</h1>
                  </div>
              </div>
            </Link>
        
              {/* Heading */}
              <div className='flex items-center bg-white rounded-r-2xl justify-between px-6 w-full py-3'>
                {/* title */}
                <div className=' flex flex-col gap-1'>
                  <h1 className='font-semibold leading-[0.8] text-lg'>Lest see</h1>
                </div>
        
                {/* button */}
                <div className='flex'>
                  {/* hapus */}
                  <button onClick={() => setTaskToDelete(project.id)}  className='hover:bg-error active:hover:bg-error px-2 py-2 transition-all hover:text-white active:text-white rounded-lg flex items-center'>
                    <i className='bx bx-trash text-2xl'></i>
                  </button>
                </div>
              </div>
              </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}