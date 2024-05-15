// Import required modules
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pool from './db/index.js';
import {createJobPost,getAllJobPosts,deletePostById, updatePostById, getJobById,getCompanyJobPosts,getAdmin ,insertUser,getUser,insertApplication,getAppliedJobPosts , getAppliedUsers} from './db/utils.js';
import { adminAuthentication ,userAuthentication} from './authmiddleware.js';

dotenv.config();

// Create an Express application
const app = express();

app.use(express.json());
app.use(cors());

const createTables = async()=> {
  try {
    const connection = await pool.getConnection();
    
    if (!connection) {
      console.error('Error: Failed to establish database connection');
      return;
    }
    

    //create Admins Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Admins(
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
 
    //insert admin records
    await connection.query(`
    INSERT INTO Admins (username, password) 
    VALUES 
    ('samrat', 'samrat123'),
    ('shivam', 'shivam123'),
    ('pallabi', 'pallabi123')
    ON DUPLICATE KEY UPDATE password = VALUES(password);
    `)
    
    //users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `)
    // Create Company table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Company (
        company_id INT PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(255) NOT NULL
      )
    `);

    // Create Job table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Job (
        job_id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT,
        position VARCHAR(255) NOT NULL,
        job_description TEXT,
        job_type VARCHAR(50),
        location_name VARCHAR(50),
        FOREIGN KEY (company_id) REFERENCES Company(company_id)
      )
    `);
     await connection.query(`
      CREATE TABLE IF NOT EXISTS Jobapplication (
        application_id INT PRIMARY KEY AUTO_INCREMENT,
        job_id INT,
        user_id INT,
        FOREIGN KEY (job_id) REFERENCES Job(job_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );
     `)
    connection.release();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}


// Define routes
app.get('/', (req, res) => {
  res.send('Hello From ,Jobify!');
});

//admin login
app.post('/admin/login',async(req,res)=>{
  try{
    const {username,password} =  req.body;
    const admin = await getAdmin(username,password);
    if (!admin) {
      return res.status(401).send('Invalid username or password');
    }else{
      const payload = {
        username: admin.username,
      }
      const token  = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
      res.json({token});
    }
  }catch(error){
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// endpoint to post a new job 
app.post('/job',adminAuthentication,async(req,res)=>{
  try{
    const {companyName,position,jobDescription,jobType,locationName } = req.body;

    if (!companyName || !position || !jobDescription || !jobType || !locationName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const job =  await createJobPost(companyName,position,jobDescription,jobType,locationName);
    
    res.status(201).json({ message: 'Job post created successfully'});
  }
  catch(error){
    console.error('Error creating job post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

//endpoint to get all the jobs
app.get('/jobs',async(req,res)=>{
  try{
    const data = await getAllJobPosts();

    res.status(200).json({data});
  }catch(error){
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//endpoint to get a specific job by jobId
app.get('/job/:jobId',async(req,res)=>{
  try{
    const jobId = req.params.jobId;
    const job = await getJobById(jobId);
    if(!job){
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({ job });
  }catch(error){
    console.error('Error getting job by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// endpoint to delete a job by ID
app.delete('/job/:jobId',adminAuthentication,async(req,res)=>{
  try{
    const id = req.params.jobId;

    await deletePostById(id);
    res.status(200).json({ message: 'Job post deleted successfully' });
  }catch(error){
    console.error('Error deleting job post:', error);
    res.status(500).json({error:"Internal server error"});
  }
})

// endpoint to update a job by ID
app.put('/job/:jobId',adminAuthentication,async(req,res)=>{
  try{
    const jobId =  req.params.jobId;
    const {position, job_description, job_type, location_name} = req.body;

    const updatedJobPostData = {
      position,
      job_description,
      job_type,
      location_name,
    };
    await updatePostById(jobId,updatedJobPostData);

    res.status(200).json({ message: 'Job post updated successfully' });
  }catch(error){
    console.error('Error updating job post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


// endpoint to get jobs by a particular companyName
app.get('/jobs/company/:companyName',async(req,res)=>{
  try{
    const companyName = req.params.companyName;

    const jobs = await getCompanyJobPosts(companyName);
    jobs.company_name = companyName;
    if(!jobs){
      return res.status(404).json({ error: 'Jobs not found' });
    }
    res.status(200).json({jobs});

  }catch(error){
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


//user signup route
app.post('/user/signup',async(req,res)=>{
  try{
    const {username, password, email } = req.body;
    const user  =  await insertUser(username,password,email);
    console.log(user[0].user_id);
    if(!user){
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }else{
      const payload = {
        user_id: user[0].user_id,
      }
      const token  = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
      res.json({token});
    }
  }catch(error){
    console.error('Error signing in as User:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


//user login route
app.post('/user/login',async(req,res)=>{
  try{
    const {email,password} =  req.body;
    const user = await getUser(email,password);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }else{
      const payload = {
        user_id: user[0].user_id,
      }
      const token  = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
      res.json({token});
    }
  }catch(error){
    console.error('Error logging in as User:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Track job application endpoint
app.post('/user/apply-for-job',userAuthentication,async(req,res)=>{
  const {user_id} = req;
  const {jobpost_id} = req.body;

  await insertApplication(user_id,jobpost_id);
  res.status(201).json({ message: 'Job application submitted successfully' });
})


// Jobs applied to by a particular user
app.get('/user/jobs/applied',userAuthentication,async(req,res)=>{
  try{
    const userId = req.user_id;
    const appliedJobPosts = await getAppliedJobPosts(userId);

    res.status(200).json({ data: appliedJobPosts });

  }catch(error){
    console.error('Error fetching applied job posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//route to get all users who have applied for a specific job
app.get('/job/:jobId/applicants',adminAuthentication,async(req,res)=>{
  try{
    const jobId = req.params.jobId;

    const applicants = await getAppliedUsers(jobId);

    res.status(200).json({ applicants: applicants });

  }catch(error){
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


// Start the server
async function startServer() {
  try {
    // Create tables
    await createTables();

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();


