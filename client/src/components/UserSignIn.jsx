import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function UserSignin({setIsUserLoggedIn}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        setIsUserLoggedIn(true);
        navigate('/user-dashboard');
      } else {
        console.error('User signin failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error signing in user:', error);
    }
  };

  return (
    <div class="flex min-h-full justify-center">
      <div class="bg-white mt-24 pt-4 pb-12 px-24 rounded-t-xl rounded-b-xl shadow-xl w-1/3">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">User SignIn</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
              <div class="mt-2">
                <input 
                  id="username" 
                  name="username" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div class="mt-2">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign In</button>
            </div>
          </form>
          <p class="mt-10 text-center text-sm text-gray-500">
            Not a member? 
            <a href="/user-signup" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign Up As A User</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignin;
