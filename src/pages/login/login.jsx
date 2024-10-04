import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 
import '../../assets/styles/mainScreen.css';
import { postData } from "../../config/apiServices/apiServices";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    console.log(data)
    
    try {
      const response = await postData("auth", data); 
      console.log(response)

      // SweetAlert for successful login
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Redirecting to the main dashboard...',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/'); 
      }, 2000);
      
    } catch (error) {
      setError(error.message);
      
      // SweetAlert for login error
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainForm">
      <div className="form-container">
        <div className="logo-container">
          Admin SignIn
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="userName"
              {...register('userName', { required: 'Username is required' })}
              placeholder="Enter your Username"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <button className="form-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'LogIn'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p className="signup-link">
          <a href="#" className="signup-link link">
            Forgot Password
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
