import React from 'react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userLoginContext } from '../../context/userLoginContext';
import './Login.css';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";
const Login = () => {
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = "(ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890)";
    const matrix = letters.split("");
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    function drawMatrix(){
      {/*ctx.fillStyle = "rgb(61, 141, 122,0.1)";*/}
      ctx.fillStyle = "rgb(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      {/*ctx.fillStyle = "rgb(61, 141, 122)";*/}
      ctx.fillStyle = "#00ff00"
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
          }
          drops[i]++;
      }
    }
    setInterval(drawMatrix, 40);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);
  let { loginUser, userLoginStatus ,loginWithGoogle,err} = useContext(userLoginContext);
  let [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    let {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
  function onUserLogin(userCred) {
    loginUser(userCred);
    //console.log(userCred);
    //console.log(userLoginStatus);
  }
  useEffect(() => {
    console.log("User login status:", userLoginStatus);
    if (userLoginStatus === true) {
      navigate("/user-profile");
    }
  }, [userLoginStatus]);

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userEmail = result.user.email;
    //console.log("User Info:", result.user);
    loginWithGoogle(userEmail);
  } catch (error) {
    console.error("Google Login Error:", error);
  }
};
  return (
    <div>
      <canvas id="matrixCanvas"></canvas>
    <div>
      <p className='display-3'>User Login</p>
      <div className='row'>
        <div className='col-11 col-sm-10 col-md-6 mx-auto'>
        <form className='register-form mt-3 p-3' onSubmit={handleSubmit(onUserLogin)}>
          <p className='google-cnt text-center'>Continue with Google</p>
          <img
            src="https://static-00.iconduck.com/assets.00/google-icon-1024x1024-8fhonw29.png"
            alt="Google Sign-In"
            className="google-img"
            width="50"
            style={{ cursor: "pointer" }}
            onClick={handleGoogleLogin}
          />
          <hr />
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>Username</label>
            <input
              type='text'
              id='username'
              className='form-control'
              {...register("username", { required: true })}
            />
            {errors.username?.type === 'required' && <p className='text-danger lead'>*This field is required.</p>} 
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              className='form-control'
              {...register("password", { required: true })}
            />
            {errors.password?.type === 'required' && <p className='text-danger lead'>*This field is required.</p>}
          </div>
          <div className='mb-3 form-check'>
            <input
              type='checkbox'
              id='showPassword'
              className='form-check-input'
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor='showPassword' className='form-check-label ms-2 mt-2'>Show Password</label>
          </div>
          {err && <p className="text-danger text-center">{err}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        </div>
      </div>
    </div>
    </div>
  );
}
export default Login;