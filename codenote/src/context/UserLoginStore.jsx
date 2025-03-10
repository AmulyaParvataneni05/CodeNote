import { userLoginContext } from "./userLoginContext";
import { useState } from "react";

function UserLoginStore({ children }) {
  let [currentUser, setCurrentUser] = useState(null);
  let [userLoginStatus, setUserLoginStatus] = useState(false);
  let [err, setErr] = useState("");
  async function loginUser(userCred) {
    try {
      let res = await fetch('https://code-note-api.vercel.app//users/login',{
                method:'POST',
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(userCred)
            })
      //let usersList = await res.json();
      //console.log("users list", usersList);
      let result = await res.json();
      if (result.message === 'Login successful')
      {
       setCurrentUser(result.user)
       setUserLoginStatus(true)
       setErr('')
       //save token in session storage
       sessionStorage.setItem('token',result.token)
      }
      else
      {
        setErr(result.message);
        setCurrentUser({})
        setUserLoginStatus(false)
      }
    } catch (error) {
      setErr(error.message);
    }
  }
  function logoutUser() {
    setCurrentUser({});
    setUserLoginStatus(false);
    setErr('')
    sessionStorage.removeItem('token')
  }
  async function loginWithGoogle(userEmail) {
    try {
      let res = await fetch("https://code-note-api.vercel.app//users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      let result = await res.json();
      //console.log("Google Login API Response:", result);
      if (result.exists && result.token) {
        setCurrentUser(result.user);
        setUserLoginStatus(true);
        setErr("");
        sessionStorage.setItem("token", result.token);
      } else {
        setErr("User does not exist. Please sign up.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErr("Google login failed. Please try again.");
    }
  }
  return (
    <userLoginContext.Provider
      value={{ loginUser, logoutUser, loginWithGoogle,userLoginStatus,err,currentUser,setCurrentUser }}
    >
      {children}
    </userLoginContext.Provider>
  );
}

export default UserLoginStore;