import logo from './logo.svg';
import './App.css';
import Player from './Player';
import SongList from './SongList';
import Upload from './upload'
import Cookies from "universal-cookie";
import Button from '@mui/material/Button';
import { CookieSharp } from '@mui/icons-material';

const cookies = new Cookies();
const user=cookies.get("USERNAME");

function App() {
  return (
    <div className="flex flex-row flex-wrap content-center h-fit">
      <div className="flex flex-row justify-start fixed z-40 align-center h-fit w-full backdrop-blur-lg shadow-sm">
        <p className="align-self-start font-mono text-3xl p-4 font-semibold  w-fit whitespace-nowrap">Play it</p>
        <div className="grid place-content-center">
        <p className="align-self-middle font-mono text-md p-0 w-fit align-middle text-center  h-full">@{user}</p>
        </div>
        <div className="w-full flex flex-row justify-end p-3">
        <Button sx={{border:2,borderColor:"black"}} className="justify-self w-fit text-end m-3 h-full border-black border-2" variant="contained" onClick={()=>{cookies.remove("USERNAME",{ path: '/' });cookies.remove("TOKEN",{ path: '/' });window.location.href = "/login";}}>Sign Out</Button>
        </div>
      </div>
      <div className="z-30 flex flex-row justify-center align-center w-full mt-24">
        <p className="align-self-start font-mono text-md pl-10 pr-10 text-center font-semibold">Play songs from the below list or click add to upload songs</p>
      </div>
      <div className="z-30 w-full flex flex-row justify-center item-center">
        <SongList/>
      </div>
      <div className="z-30 fixed bottom-0 left-0 right-0 w-full flex flex-row justify-center item-center">
        <Player/>
      </div>
    </div>
  );
}

export default App;
