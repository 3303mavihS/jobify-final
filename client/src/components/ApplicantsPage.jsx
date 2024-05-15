import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
const ApplicantsPage = () => {
  const location = useLocation();
  const { jobId } = location.state;
  console.log(jobId);
  const [applicants, setApplicants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:8080/job/${jobId}/applicants`,{headers: {
          'Authorization': `Bearer ${token}`}
        });
        if (response.ok) {
          const data = await response.json();
          setApplicants(data.applicants);
          setErrorMessage('');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setErrorMessage('Internal server error');
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="justify-center">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Applicants for Job ID: {jobId}</h1>
        </div>
      </header>
      <div class="flex min-h-full justify-center">
        <div class="bg-white m-12 p-12 rounded-t-xl rounded-b-xl shadow-xl w-3/4">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-base text-white uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-base text-white uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-base text-white uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap">{applicant.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{applicant.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{applicant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
