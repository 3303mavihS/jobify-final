import React, { useState, useEffect } from 'react';
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AllJobPosts() {
  const [jobPosts, setJobPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobPosts(data.data);
          setErrorMessage('');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error);
        }
      } catch (error) {
        console.error('Error fetching job posts:', error);
        setErrorMessage('Internal server error');
      }
    };

    fetchJobPosts();
  }, []);
  

  const handleDeleteJobPost =  async(jobId) =>{
    try{
      const response = await fetch(`http://localhost:8080/job/${jobId}`,{
        method:'DELETE',
        headers: {
          'Authorization':"Bearer " + localStorage.getItem("token")
        },
      })
      if(response.ok){
        setJobPosts(jobPosts.filter(jobpost => jobpost.job_id !== jobId));
        setErrorMessage('');
      }else{
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    }catch(error){
      console.error('Error deleting job post:', error);
      setErrorMessage('Internal server error');
    }
  }
  const handleShowApplicants = async(jobId)=>{
    const data = { jobId: jobId };
    navigate(`/applicants/${jobId}`,{state: data});
  }
  return (
    <div className="justify-center">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <div className="flex justify-center">
        <div className="w-10/12 bg-white rounded-xl shadow-xl border my-8 mx-20 p-20">
          
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">{jobPosts.length} Jobs Found</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          
          {jobPosts.map((jobPost) => (
            <div className="w-full border rounded-xl p-4 px-6 lg:items-center lg:justify-between mb-8" key={jobPost.job_id}>
              <div className="flex flex-row">
                <div className="basis-1/2 min-w-0 ">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{jobPost.position}</h2>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              
                    <div className="mt-2 flex items-center text-base text-gray-500">
                      <AiFillHome className="text-gray-400 h-5 w-5 space-x-2"/> 
                      <div className="mr-2">{jobPost.company_name}</div>
                    </div>
                    <div className="mt-2 flex items-center text-base text-gray-500 mr-px-2">
                      <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clip-rule="evenodd" />
                        <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                      </svg>
                      {jobPost.job_type}
                    </div>
                    <div className="mt-2 flex items-center text-base text-gray-500">
                      <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                      </svg>
                      {jobPost.location_name}
                    </div>
                  </div>
                </div>
                <div className="basis-1/2 flex justify-end items-center mt-5 lg:ml-4 lg:mt-0">
                  <span className="hidden sm:block">
                    <Link to={{pathname:`/update-job-post/${jobPost.job_id}`, state: { jobId: jobPost.job_id } }}type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Edit
                    </Link>
                  </span>
              
                  <span className="ml-3 hidden sm:block">
                    <button onClick={() => handleShowApplicants(jobPost.job_id)} type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      View Applicants
                    </button>
                  </span>
              
                  <span className="sm:ml-3">
                    <button onClick={()=> handleDeleteJobPost(jobPost.job_id)} type="button" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Delete
                    </button>
                  </span>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-base ">{jobPost.job_description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllJobPosts;