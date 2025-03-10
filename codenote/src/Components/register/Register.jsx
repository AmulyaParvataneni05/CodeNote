import React from 'react'
import './Register.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";
const Register = () => {
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
  let { register, handleSubmit, formState: { errors }, watch } = useForm();
  let [err, setErr] = useState('');
  let [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  async function onUserRegister(newUser) {
    console.log(newUser);
    try {
        let res = await fetch("https://deployment-test-gilt.vercel.app/users/register", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: newUser.username,
              password: newUser.password,
              confirmpassword: newUser.confirmPassword,
              email: newUser.email,
            }),
        });

        let data = await res.json();
        console.log("Response:", data);

        if (res.ok && data.message === "User created successfully") {
            navigate('/Login');
        } else {
            setErr(data.message || "Unknown error occurred");
        }
    } catch (err) {
        console.error("Fetch error:", err);
        setErr(err.message);
    }
}
    const GoogleSignup = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;
        const response = await fetch("https://deployment-test-gilt.vercel.app/users/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });
        const data = await response.json();
        if (data.exists) {
          alert(`This email is already registered as '${data.user.username}'. Please log in.`);
          navigate("/login");
          return;
        }
        const userName = prompt("Enter a username:");
        const userPassword = prompt("Set a password:");
        const confirmPassword = prompt("Confirm your password:");
        if (!userName || !userPassword || !confirmPassword) {
          alert("Signup canceled. Username and password are required.");
          return;
        }
        const registerResponse = await fetch("https://deployment-test-gilt.vercel.app/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userName,
            email: userEmail,
            password: userPassword,
            confirmpassword: confirmPassword,
            authType: "google",
          }),
        });
        const registerData = await registerResponse.json();
        if (registerData.success) {
          sessionStorage.setItem("token", registerData.token);
          sessionStorage.setItem("currentUser", JSON.stringify(registerData.user));
          navigate("/user-profile");
        } else {
          alert(registerData.message);
        }
      } catch (error) {
        console.error("Google Signup Error:", error);
      }
    };
    /*const handleGoogleSignUp = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;
        //console.log("User Info:", result.user);
        loginWithGoogle(userEmail);
      } catch (error) {
        console.error("Google Login Error:", error);
      }
    };*/
  return (
    <div>
      <canvas id="matrixCanvas"></canvas>
      <div>
      <p className='display-3'>Create Your CodeNote Account</p>
      <div className='row'>
        <div className='col-11 col-sm-10 col-md-6 mx-auto'>
        <form className='register-form p-3 ' onSubmit={handleSubmit(onUserRegister)}>
          <p className="google-cnt text-center">Continue with Google</p>
          <img src = 'https://static-00.iconduck.com/assets.00/google-icon-1024x1024-8fhonw29.png'
          className='google-img'
          width="50"
          style={{ cursor: "pointer" }}
          onClick={GoogleSignup}></img>
          <hr></hr>
          <div className=''>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>Username: *</label>
              <input type='text' id='username' className='form-control' {...register("username",{required:true,minLength:5,maxLength:15})}></input>
              {errors.username?.type === 'required'&&<p className='text-danger lead'>*This field is Required.</p>}
              {errors.username?.type === 'minLength'&&<p className='text-danger lead'>*The Minimum Length of this field is 5.</p>}
              {errors.username?.type === 'maxLength'&&<p className='text-danger lead'>*The Maximum Length of this field is 15.</p>} 
            </div>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>Email-Id *</label>
              <input type='email' id='email' className='form-control' {...register("email",{required:true})}></input>
              {errors.email?.type === 'required'&&<p className='text-danger lead'>*This Field is Required</p>}
            </div>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>Password *</label>
              <input type={showPassword ? 'text' : 'password'} id='password' className='form-control' {...register("password",{required:true,minLength:8,maxLength:15})}></input>
              {errors.password?.type === 'required'&&<p className='text-danger lead'>*This field is Required.</p>}
              {errors.password?.type === 'minLength'&&<p className='text-danger lead'>*The Minimum Length of this field is 8.</p>}
              {errors.password?.type === 'maxLength'&&<p className='text-danger lead'>*The Maximum Length of this field is 15.</p>} 
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmPassword' className='form-label'>Confirm Password *</label>
              <input type={showPassword ? 'text' : 'password'} id='confirmPassword' className='form-control' {...register("confirmPassword",{required: true,validate: (value) => value === password || "Passwords do not match"})}/>
              {errors.confirmPassword && <p className='text-danger lead'>*{errors.confirmPassword.message}</p>}
            </div>
            <div className='mb-3 form-check'>
              <input type='checkbox' id='showPassword' className='form-check-input' onChange={() => setShowPassword(!showPassword)}/>
              <label htmlFor='showPassword' className='form-check-label ms-2 mt-2'>Show Password</label>
            </div>
            <button className='login-btn'>Register</button>
          </div>
      </form>
        </div>
      </div>
    </div>
    </div>
  )
}
export default Register;