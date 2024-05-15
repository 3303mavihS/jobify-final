import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddJobPost from './components/AddJobPost.jsx';
import AllJobPosts from './components/AllJobPosts.jsx';
import UpdateJobPost from './components/UpdateJobPost.jsx';
import Header from './components/Header.jsx';
import SearchByCompany from './components/SearchByCompany.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import UserSignup from './components/UserSignUp.jsx';
import UserSignin from './components/UserSignIn.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import ApplicantsPage from './components/ApplicantsPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === "true");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(localStorage.getItem('isUserLoggedIn') === "true");
  useEffect(()=>{
    localStorage.setItem('isLoggedIn',isLoggedIn.toString());
    localStorage.setItem('isUserLoggedIn', isUserLoggedIn.toString());
  },[isLoggedIn,isUserLoggedIn])
  
  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />
      <div className=" mx-auto">
        <Routes>
          <Route  path={"/"} element={<AdminLogin setIsLoggedIn={setIsLoggedIn}/>} />
          <Route  path={"/user-signup"} element={<UserSignup setIsUserLoggedIn={setIsUserLoggedIn}/>} />
          <Route  path={"/user-signin"} element={<UserSignin setIsUserLoggedIn={setIsUserLoggedIn}/>} />
          {isLoggedIn && (
            <>
              <Route  path={"/dashboard"} element={<AllJobPosts/>} />
              <Route path={"/add-job-post"} element={<AddJobPost/>} />
              <Route path={"/update-job-post/:jobId"} element={<UpdateJobPost jobId/>} />
              <Route path='/search-by-company' element={<SearchByCompany/>}/>
              <Route path='/search-by-company' element={<ApplicantsPage/>}/>
              <Route path='/applicants/:jobId' element={<ApplicantsPage/>}/>
            </>
          )}
          {isUserLoggedIn &&(
            <>
            <Route path='/user-dashboard' element={<UserDashboard/>}/>
            </>
          )

          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
