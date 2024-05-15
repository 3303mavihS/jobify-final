import pool from './index.js';

const connection =  await pool.getConnection();

export const getAdmin = async(username ,password)=>{
  try{
    const [row] = await connection.query(`SELECT * from Admins WHERE username = ? AND password = ?`,[username,password]);
    connection.release();
    if(row.length === 0){
      return null;
    }else{
      return row;
    }
  }catch(error){
    console.error('Error fetching Admin Details:', error);
    throw error;
  }
}

export const createJobPost = async(companyName, position, jobDescription, jobType, locationName)=>{
  try{
    await connection.beginTransaction();
    
    let [companyRows] = await connection.query(`SELECT company_id 
    FROM Company 
    WHERE company_name = ?
    `,[companyName]
    );
    let companyId;
    if(companyRows.length === 0 ){
      const [companyResult] =  await connection.query(`
      INSERT INTO Company (company_name) values (?)
      `,[companyName]);

      companyId = companyResult.insertId;
    }else{
      companyId = companyRows[0].company_id;
    }
    
    await connection.query(`
    INSERT INTO Job (company_id, position, job_description, job_type, location_name) VALUES (?, ?, ?, ?, ?)
    `,[companyId, position, jobDescription, jobType, locationName]);

    await connection.commit();

    connection.release();

    console.log('Job Post Created Successfully');

  }catch(error){
    console.error('Error creating job post:', error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
  }
}

export const getAllJobPosts = async()=>{
  try{
    const [rows] = await connection.query(`SELECT * from Company RIGHT JOIN Job ON Company.company_id = Job.company_id ORDER BY Job.job_id DESC`);

    connection.release();
    return rows;
  }catch(error){
    console.error('Error fetching job posts:', error);
    throw error;
  }
}

export const getJobById=  async(jobId) => {
  try {
    // Query the database to get the job
    const [rows] = await connection.execute('SELECT * FROM Job  WHERE job_id = ? ', [jobId]);

    // Release the connection back to the pool
    connection.release();

    // Return the job if found, otherwise return null
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error getting job by ID:', error);
    throw error;
  }
}

export const deletePostById = async(jobId)=>{
  try{
    
    await connection.query(`DELETE FROM Job WHERE job_id = ?`,[jobId])

    connection.release();

  }catch(error){
    console.error('Error deleting job post:', error);

    throw  error;
  }
} 

export const updatePostById = async(jobId,updatedJobPostData) =>{
  try{
    await connection.query(`UPDATE Job SET ? WHERE job_id = ? `,[updatedJobPostData,jobId]);

    connection.release();
  }catch(error){
    console.error('Error updating job post:', error);
    throw error;
  }
}

export const queryJobByCompanyId =  async(companyId) =>{
  try{
    
    const [rows] = await connection.query(`SELECT * from Company RIGHT JOIN Job ON Company.company_id = Job.company_id`);

    connection.release();
    return rows;

  }catch(error){
    
  }
}


export const getCompanyJobPosts = async(companyName)=>{
  try{
    const [rows] = await connection.query(`SELECT Job.* FROM Company JOIN Job ON Company.company_id = Job.company_id WHERE Company.company_name = ?`,[companyName]);

    connection.release();
    return rows;
  }catch(error){
    console.error('Error fetching job posts:', error);
    throw error;
  }
}


export const insertUser =  async(username,password ,email)=>{
  try{
    await connection.query(`
      INSERT INTO User (username , password , email) VALUES (?, ? , ?)
      `,[username, password, email]
    );
    const [result] = await connection.query(` 
    SELECT * FROM User WHERE email = ? AND password = ?
    `,[email,password]);

    connection.release();

    if(result.length === 0){
      return null;
    }else{
      return result;
    }
  }catch(error){
    console.error('Error inserting userdetails to db:', error);
    throw error;
  }
}

export const getUser = async(email,password)=>{
  try{
    const [result] = await connection.query(`
      SELECT * FROM User WHERE email = ? AND password = ?
    `,[email,password]);
    connection.release();
    if(result.length === 0){
      return null;
    }else{
      return result;
    }
  }catch(error){
    console.error('Error while Logging:', error);
    throw error;
  }
}


export const insertApplication = async(user_id,jobpost_id)=>{
  try{
    await connection.query(`
    INSERT INTO Jobapplication (job_id, user_id) VALUES (?, ?)`, [ jobpost_id,user_id]
    );
    connection.release();
  }catch(error){
    console.error('Error inserting Application to db:', error);
    throw error;
  }
}


export const getAppliedJobPosts = async(user_id) =>{
  try{
    const [rows] = await connection.query(`
    SELECT j.*, c.company_name
    FROM Job j
    JOIN Jobapplication ja ON ja.job_id = j.job_id
    JOIN Company c ON j.company_id = c.company_id
    WHERE ja.user_id = ?;
    `,[user_id]);
    connection.release();
    
    return rows;
    
  }catch(error){
    console.error('Error while getting details:', error);
    throw error;
  }
}


export const getAppliedUsers = async(user_id)=>{
  try{
    const [rows] = await connection.query(`
      SELECT u.*
      FROM User u
      JOIN Jobapplication ja ON u.user_id = ja.user_id
      WHERE ja.job_id = ?;
    `,[user_id]);
    connection.release();
    
    return rows;
    
  }catch(error){
    console.error('Error while getting details:', error);
    throw error;
  }
}