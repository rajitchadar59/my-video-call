import React, { useContext, useState } from "react";
import { Box, Button, Snackbar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "./Authentication.css";
import { AuthContext } from "../context/AuthContext";
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {

  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [message, setmessage] = useState("")
  const [open, setopen] = useState(false)

  const { handleRegister, handleLogin } = useContext(AuthContext);
  const routeTo = useNavigate();

  let handleAuth = async () => {
    try {
      if (isSignIn) {
        let result = await handleLogin(username, password);
        setmessage(result);
        setopen(true);
        seterror("")
        setusername("");
        setpassword("");
      }

      if (!isSignIn) {

        let result = await handleRegister(name, username, password);
        setmessage(result);
        setopen(true);
        setIsSignIn(true);
        seterror("")
        setusername("");
        setpassword("");


      }
    }
    catch (err) {
      console.log(err)

      seterror(err.message);

    }

  }

  return (
    <>
      <Box className="authPage">


        <IconButton
          onClick={() => routeTo("/")}
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            color: "white",
            zIndex: 1000,
          }}
        >
          <HomeIcon />
        </IconButton>



        <Box className="formContainer">
          <Typography variant="h6" className="formTitle">
            {isSignIn ? (
              <>
                <LoginIcon sx={{ marginRight: 1 }} style={{ marginBottom: "1.5rem" }} />
                <p style={{ marginBottom: "1.5rem" }}> Sign In</p>
              </>
            ) : (
              <>
                <PersonAddIcon sx={{ marginRight: 1 }} style={{ marginBottom: "1.5rem" }} />
                <p style={{ marginBottom: "1.5rem" }}>Sign Up </p>
              </>
            )}
          </Typography>

          <Box component="form" className="formBox">
            {!isSignIn && (
              <div className="inputGroup">
                <AccountCircleIcon className="inputIcon" />
                <div className="inputWrapper">
                  <input type="text" name="name" placeholder=" " required value={name} onChange={(e) => setname(e.target.value)} />
                  <label className="floatingLabel">Name</label>
                </div>
              </div>
            )}

            <div className="inputGroup">
              <PersonIcon className="inputIcon" />
              <div className="inputWrapper">
                <input type="text" name="username" placeholder=" " required value={username} onChange={(e) => setusername(e.target.value)} />
                <label className="floatingLabel">Username</label>
              </div>
            </div>

            <div className="inputGroup">
              <LockIcon className="inputIcon" />
              <div className="inputWrapper">
                <input type="password" name="password" placeholder=" " required value={password} onChange={(e) => setpassword(e.target.value)} />
                <label className="floatingLabel">Password</label>
              </div>
            </div>

            <p style={{ color: "red" }}>{error}</p>

            <Button type="button" fullWidth className="submitBtn" onClick={handleAuth}>
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>

            <Button
              fullWidth
              className="toggleBtn"
              onClick={() => setIsSignIn(!isSignIn)}
            >
              {isSignIn
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Button>


          </Box>
        </Box>
      </Box>


      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setopen(false)}
      />


    </>

  );
};

export default Authentication;
