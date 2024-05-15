// AddJobPost.js
import React, { useState } from 'react';
import  { useNavigate}  from 'react-router-dom';

function AddJobPost() {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate  = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':"Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          companyName,
          position,
          jobDescription,
          jobType,
          locationName,
        }),
      });
      if (response.ok) {
        console.log(response);
        setSuccessMessage('Job post created successfully');
        setErrorMessage('');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error creating job post:', error);
      setErrorMessage('Internal server error');
      setSuccessMessage('');
    }
  };

  return (
    <div className="justify-center">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Add Job Post</h1>
        </div>
      </header>
      <div class="flex min-h-full justify-center">
        <div class="bg-white m-12 p-12 rounded-t-xl rounded-b-xl shadow-xl w-1/3">
          <form class="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label for="companyName" class="block text-sm font-medium leading-6 text-gray-900">Company Name</label>
              <div class="mt-2">
                <input 
                  id="companyName" 
                  name="companyName" 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <label for="position" class="block text-sm font-medium leading-6 text-gray-900">Position</label>
              <div class="mt-2">
                <input 
                  id="position" 
                  name="position" 
                  type="text" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <label for="jobDescription" class="block text-sm font-medium leading-6 text-gray-900">Job Description</label>
              <div class="mt-2">
                <textarea 
                  id="jobDescription" 
                  name="jobDescription" 
                  type="text" 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
              </div>
            </div>

            <div>
              <label for="jobType" class="block text-sm font-medium leading-6 text-gray-900">Job Type</label>
              <div class="mt-2">
                <input 
                  id="jobType" 
                  name="jobType" 
                  type="text" 
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <label for="locationName" class="block text-sm font-medium leading-6 text-gray-900">Location Name</label>
              <div class="mt-2">
                <input 
                  id="locationName" 
                  name="locationName" 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Job Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddJobPost;
