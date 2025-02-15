"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from 'luxon';
import { useParams } from "next/navigation";
import Notif from "./notif";
import api from "../utils/api";


type Task = {
  id: number;
  Title: string;
  Priority: string;
  Date: string;
  Time: string;
  CategoryID: string;
  ProjectID: number | null;
};

type Project = {
  id: number;
  name: string;
  tasks: Task[];
};

const AddTask = ({ onClose, idProject }: { onClose: () => void, idProject: number } ) => {
  const { id } = useParams();
  const projectId = Number(id) ;
  const [categories, setCategories] = useState<{CategoryID: number; Name: string }[]>([]);
  const [projects, setProject] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>(projectId);
  const [newTask, setNewTask] = useState({
    Title: "",
    Priority: "low",
    Date: "",
    Time: "",
    CategoryID: 1,
    ProjectID: idProject,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(newTask.Date ? new Date(newTask.Date) : null);

  // notif
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    api
    .get("/api/categories")
    .then((response) => {
      setCategories(response.data);
      if (response.data.length > 0) {
        setNewTask((prev) => ({
          ...prev,
          CategoryID: response.data[0].CategoryID,
        }));
      }
    })
    .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // categori
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewTask((prev) => ({
      ...prev,
      CategoryID: Number(e.target.value),
    }));
  };
  // Fetch categories
  useEffect(() => {
    if (!projectId) {
      api
        .get("/api/projects")
        .then((response) => setProject(response.data))
        .catch((error) => console.error("Error fetching projects:", error));
    }
  }, [projectId]);

  // Fetch project data
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setNewTask((prev) => ({
      ...prev,
      [name]: name === "ProjectID" ? (value ? Number(value) : null) : value
    }));
  };
  

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setNewTask((prev) => ({
        ...prev,
        Date: date.toISOString().split("T")[0],
      }));
    }
  };

  const handleProjectSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedProject(selectedId);
    setNewTask((prev) => ({
      ...prev,
      ProjectID: selectedId,
    }));
  };
  
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setNewTask((prev) => ({
      ...prev,
      Time: `${timeValue}:00`,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let idproject = newTask.ProjectID
    console.log("id",newTask)
    try {
      await api.post("/api/tasks", {
        ...newTask,
        ProjectID : idproject,
        CategoryID: newTask.CategoryID,
        
      });
      showNotification("Task added successfully! ✅");
      setNewTask({
        Title: "",
        Priority: "",
        Date: "",
        Time: "",
        CategoryID: newTask.CategoryID,
        ProjectID: idproject ,
      });


      // Refresh project tasks
      if (selectedProject) {
        const projectRes = await api.get(`/api/projects/${selectedProject}`);
        setProject([projectRes.data]);
    }
    } catch (error) {
      console.error(" Error adding task:", error);
    }
  };
      
  return (
    <>
    {notification && <Notif message={notification} onClose={() => setNotification(null)} />}
    <section className="w-72 z-20 absolute rounded-3xl right-0 shadow-[1px_10px_39px_21px_rgba(0,_0,_0,_0.1)]">
      <div className="bg-white rounded-lg p-4">
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col gap-6">
            <div className="">
              {/* Title */}
              <input
                name="Title"
                className="focus:outline-none border-b-2 p-1 w-full bg-transparent"
                onChange={handleChange}
                type="text"
                placeholder="New Project"
                value={newTask.Title}
                required
              />
            </div>
            {/* Project */}
           {!projectId && (
             <div className="relative">
             <select onChange={handleProjectSelect} className="select select-floating max-w-sm" aria-label="Select floating label" id="selectFloating">   
              {projects.map((prj) => (
                <option key={prj.id} value={prj.id}>
                  {prj.name}
                </option>
              ))}  
              </select>
             <label className="select-floating-label" htmlFor="selectFloating">Project</label>
           </div>
           )}

            {/* date */}
            <div className="relative flex flex-col gap-2">
              <DatePicker
                dateFormat="EEEE, dd MMMM yyyy"
                selected={selectedDate}
                onChange={handleDateChange}
                className=" w-full"
                placeholderText="Select a date"
               
                customInput={(
                  <div className="relative w-full">
                    <input 
                      className="border p-2 rounded-md w-full pl-10 pr-8 focus:outline-none"
                      value={selectedDate ? DateTime.fromJSDate(selectedDate).toFormat("EEEE, dd MMMM yyyy") : ""}
                      readOnly
                      placeholder="Select a date"
                    />
                    <i className='bx bx-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg'></i>

                    {selectedDate && (
                      <i className='bx bx-x absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer' onClick={() => setSelectedDate(null)}></i>
                    )}
                  </div>
                )}
              />
              <label className="select-floating-label">Date</label>
              
            </div>
              {/* priority */}
              <div className="flex flex-col gap-2">
              <label htmlFor="">Priority</label>
                <div className="join drop-shadow gap-0 justify-between">
                  <input className="join-item btn" type="radio" name="Priority" aria-label="Low" onChange={handleChange}  value="low" />
                  <input className="join-item btn" type="radio" name="Priority" aria-label="Medium" onChange={handleChange}  value="medium" />
                  <input className="join-item btn" type="radio" name="Priority" aria-label="High" onChange={handleChange}  value="high" />
                </div>
              </div>

              {/* kategori */}
              <div className="relative">
                <select onChange={handleCategoryChange} value={newTask.CategoryID}  className="select select-floating max-w-sm" aria-label="Select floating label" id="selectFloating">
                  {categories.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>{category.Name}</option>
                  ))}
                </select>
                <label className="select-floating-label" htmlFor="selectFloating">Categories</label>
              </div>

              {/* Time */}
              <div className="relative flex w-full">
                <input
                  name="Time"
                  type="time"
                  onChange={handleTimeChange}
                  value={newTask.Time}
                  className="w-full mt-0.5 border p-2 rounded-md"
                  required
                />
                <label className="select-floating-label">Time</label>
              </div>
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="btn btn-outline btn-error ">Cancel</button>
              <button type="submit" className="btn bg-blue text-white">Add Project</button>
            </div>
          </div>
        </form>
      </div>
    </section>
    </>
  );
};

export default AddTask;
