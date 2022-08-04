import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useRef,useState} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";



function Login(props){
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [register,setRegister]=useState(false);
    const [login, setLogin] = useState(false);
    const cookies = new Cookies();
      

    const handleLogin=()=>{
        axios.post("/login",{
            email:username,
            password:password
        })
        .then((result) => {console.log(result);setLogin(true);cookies.set("TOKEN", result.data.token, {path: "/",});cookies.set("USERNAME", username, {path: "/",});window.location.href = "/home";})
        .catch((error) => {console.log(error);})
        console.log(username+" "+password)
    }

    const handleRegister=()=>{
        axios.post("/register",{
            email:username,
            password:password
        },{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'})
        .then((result) => {console.log(result);setRegister(true);})
        .catch((error) => {console.log(error);})
        console.log(username+" "+password)
    }

    return(
        <div className="flex flex-row flex-wrap justify-center align-middle item-center h-full content-center">
            <div className="flex flex-row justify-start align-center w-full ">
                <p className="align-self-start font-mono text-3xl p-4 font-semibold ">Play it</p>
            </div>
            
            <div className="w-full h-screen fixed grid place-content-center">
            <div className="flex flex-col item-center justify-center flex-wrap m-2 p-5 border-2 border-black  rounded-lg shadow-md h-full content-center ">
                <p className="font-mono text-3xl mb-10" >Login</p>
                <TextField onChange={(event)=>{setUsername(event.target.value);}} sx={{marginBottom:2}} label="Username"></TextField>
                <TextField onChange={(event)=>{setPassword(event.target.value);}} sx={{marginBottom:7}} label="Password"></TextField>
                <div className="w-full justify-end flex flex-row">
                    <Button onClick={handleLogin} sx={{margin:1,marginRight:0}} variant="contained">Login</Button>
                    <Button onClick={handleRegister} sx={{margin:1,marginLeft:1,marginRight:0}} variant="outlined">Register</Button>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Login;