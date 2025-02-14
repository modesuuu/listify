import axios from 'axios'
import React, { useState } from 'react'

const Addproject = ({ onClose, name }: { onClose: () => void, name: string }) => {
    const [newProject, setNewProject] = useState({
        name: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProject({ ...newProject, name: e.target.value });
      };
    

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
          await axios.post("https://listify.rpl1.my.id/api/projects", newProject);
          alert("Project added successfully!");
          setNewProject({ name: "" }); 
          onClose();
        } catch (error) {
          console.error("Error adding project:", error);
        }
      };

  return (
    <>
    <section className='w-72 absolute right-0 shadow-lg'>
        <div className='bg-white rounded-lg p-4'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-6'>
                    <div>
                    <input
                        name="Title"
                        className="focus:outline-none border-b-2 p-1 w-full bg-transparent"
                        type="text"
                        placeholder="New Project"
                        value={newProject.name}
                        onChange={handleChange}
                        required
                    />
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
  )
}

export default Addproject