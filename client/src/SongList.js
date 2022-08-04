import React from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from "react-redux";
import {useRef} from 'react';
import {setCurrentSongIndex,fetchSongs} from "./SongsListSlice";
import {setSelectedSongURL} from "./PlayerSlice";
import {useEffect} from 'react';
import {setSongName,setIsPlaying} from './PlayerSlice';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import {useState} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Upload from './upload';
import axois from 'axios';
import axios from 'axios';
import { TextField } from '@mui/material';
import Cookies from "universal-cookie";
const cookies = new Cookies();
const user=cookies.get("USERNAME");




function SongList(props){
    const songs=useSelector(state=>state.SongsList.songs);
    const currentSongIndex=useSelector(state=>state.SongsList.currentSongIndex);
    const [open,setOpen]=useState(false);
    const [count,setCount]=useState(0);
    const dispatch=useDispatch();
    const [search,setSearch]=useState("");
    const [displaySongs,setDisplaySongs]=useState([])

    useEffect(()=>{
        console.log("Dispatching")
        dispatch(fetchSongs());
        console.log("done")
    },[dispatch]);

    useEffect(()=>{
        var arr=[]
        for(let i=0;i<songs.length;i++){
            if(songs[i].songName.toLowerCase().startsWith(search.toLowerCase()) && user==songs[i].username)
                arr.push(songs[i])
        }
        setDisplaySongs(arr)
    },[songs,search]);

    const onSongClick=(index)=>{
        dispatch(setCurrentSongIndex(index));
        dispatch(setSongName(displaySongs[index].songName));
        dispatch(setSelectedSongURL("/tracks/"+displaySongs[index].storedFileName));
        dispatch(setIsPlaying(false));
    }

    const onDeleteClick=(index)=>{
        axios.delete("/tracks/"+displaySongs[index].storedFileName)
        .then(()=>{setCount(count+1);console.log("Set the count");dispatch(fetchSongs());})
        .catch(()=>console.log("Error sending delete request"));
    }

    return(
        <div className="p-3  rounded-lg m-2 w-full pb-52 " >
        <div className="flex flex-row flex-wrap justify-center item-center w-full" sx={{overflow:"auto"}}>
            <div className="flex flex-row w-full h-fit item-center justify-center mb-3">
                <Button className="shadow-md whitespace-nowrap  sm:w-1/2 w-5/6 md:w-fit" sx={{color:"black",borderColor:"black",margin:0,border:2,marginLeft:1,marginRight:1,padding:1,width:"fit",fontSize:"12px"}} variant="contained" startIcon={<AddIcon className="text-white"/>} onClick={()=>{setOpen(true);}}><p className="text-white">Add Song</p></Button>
                <TextField className="shadow-md" sx={{width:"100%",marginRight:1}} label="Search" onChange={(event)=>{setSearch(event.target.value);}}></TextField>
            </div>
            <List className="w-full" sx={{overflowY:"auto",overflowX:"hidden",padding:0,paddingRight:2 }}>
            {displaySongs.map((song,index)=>{
                return(
                    <ListItem key={index} className="shadow-md border-2 border-black m-2 rounded-md" sx={{padding:0}} secondaryAction={
                        <IconButton onClick={()=>{onDeleteClick(index);}} edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemButton onClick={()=>{onSongClick(index);}} sx={{padding:1}}>
                            <ListItemText sx={{padding:0}}>
                                {song.songName}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                );
            })}
            </List>
            
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
        <Upload setOpen={setOpen}/>
        </Backdrop>
        </div>
    );
}

export default SongList;