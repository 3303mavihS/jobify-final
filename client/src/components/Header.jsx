import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';

function Header({isLoggedIn,setIsLoggedIn,isUserLoggedIn,setIsUserLoggedIn}) {
  const navigate = useNavigate();
  const handleLogout = () => {
    if(isLoggedIn){
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }
    if(isUserLoggedIn){
      localStorage.removeItem('token');
      setIsUserLoggedIn(false);
      navigate('/user-signin');
    }
  };
  return (
    
    <div class="min-h-full">
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Job Board</h1>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                
                {isLoggedIn && (
                  <>
                  <a href="/dashboard" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">All Jobs</a>
                  <a href="/add-job-post" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Add Job</a>
                  <a href="/search-by-company" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Search By Company</a>
                  <a href="#" onClick={handleLogout} class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Logout</a>
                  </>
                )}
                {isUserLoggedIn && (
                  <>
                  <a href="#" onClick={handleLogout} class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Logout</a>
                  </>
                )}
                {!isLoggedIn && !isUserLoggedIn ? (
                  <>
                  <a href="/" class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Admin</a>
                  <a href="/user-signin" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">User Sign-In</a>
                  <a href="/user-signup" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">User Sign-Up</a>
                  </>
                ): null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>      
    </div>
  );
}

export default Header;
