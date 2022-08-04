import React, { useState, useRef } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Cookies from "universal-cookie";
const cookies = new Cookies();
const user=cookies.get("USERNAME");


function Upload(props) {
  
  return (
    <div className="flex flex-col bg-white md:w-[40%] md:h-fit w-[90%] h-fit rounded-xl shadow-2xl p-5 border-4 border-black">
      <p className="text-black text-4xl font-mono text-bold mb-10">Upload</p>
      <form className="w flex flex-col justify-center align-center" action="/tracks" method="POST" encType="multipart/form-data" >
        <div className="flex flex-col align-center item-center justify-center">
            <p className="text-black font-mono">Choose file to be uploaded</p>
            <input style={{color:"black"}} className="pt-2"
              type="file"
              accept="audio"
              name="uploaded_file"
            />
            <p className="text-black font-mono mt-5 mb-2">Enter Song Name</p>
            <TextField sx={{width:"100%",color:"black"}} variant="outlined" name="songName" />
            <div className="flex flex-row justify-end w-full">
              <input name="username" hidden value={user}></input>
              <Button sx={{marginTop:2,marginBottom:2,border:2,marginRight:1,color:"black"}} variant="contained" type="submit" onClick={()=>{props.setOpen(false);}}>
                Upload
              </Button>
              <Button sx={{marginTop:2,marginBottom:2,color:"black"}} onClick={()=>{props.setOpen(false);}}>
                Cancel
              </Button>
            </div>
        </div>
      </form>
    </div>
  );
}

export default Upload;