import React from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from "react-redux";
import {useRef} from 'react';
import IconButton from '@mui/material/IconButton';
import {setIsPlaying,setCurrentTime,setDuration,setSelectedSongURL,fetchState} from "./PlayerSlice";
import {useEffect} from 'react';
import Slider from '@mui/material/Slider';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import {setCurrentSongIndex} from "./SongsListSlice";
import {setSongName} from "./PlayerSlice";

function Player(props){
    const songURL=useSelector(state=>state.player.selectedSongURL);
    const playing=useSelector(state=>state.player.isPlaying);
    const currentt=useSelector(state=>state.player.currentTime);
    const durat=useSelector(state=>state.player.duration);
    const audioElement=useRef(null);
    const songName=useSelector(state=>state.player.songName);
    const dispatch=useDispatch();
    const songs=useSelector(state=>state.SongsList.songs);
    const currentSongIndex=useSelector(state=>state.SongsList.currentSongIndex);
    var interval=null;


    useEffect(()=>{
        if(playing==null)
            dispatch(fetchState());
    },[dispatch,playing]);

    const onPlayClick=()=>{
        if(!playing){
            dispatch(setIsPlaying(true));
            audioElement.current.play();
        }
        else{
            dispatch(setIsPlaying(false));
            audioElement.current.pause();
        }
    }

    const updateCurrentTime=() => {
        dispatch(setCurrentTime(audioElement.current.currentTime));
    }

    const handleSliderChange=(event,newValue)=>{
        console.log(newValue);
        audioElement.current.currentTime=newValue/100*durat;
    };

    const handleNextClick=()=>{
        var x=currentSongIndex;
        if(x+1>songs.length)
            x=0
        else
            x=x+1
        var isp=playing;
        dispatch(setCurrentSongIndex(x));
        dispatch(setSongName(songs[x].songName));
        dispatch(setSelectedSongURL("/tracks/"+songs[x].storedFileName));
        dispatch(setIsPlaying(false));
    };

    const handlePrevClick=()=>{
        var x=currentSongIndex;
        if(x-1<0)
            x=songs.length-1
        else
            x=x-1
        var isp=playing;
        dispatch(setCurrentSongIndex(x));
        dispatch(setSongName(songs[x].songName));
        dispatch(setSelectedSongURL("/tracks/"+songs[x].storedFileName));
        dispatch(setIsPlaying(false));
    };

    return(
        <div className="opacity-100 backdrop-blur-md flex flex-row flex-wrap border-2 border-black  w-[100%] rounded-xl p-3 m-2 shadow-md item-center">
            <audio
                style={{display:"visible"}}
                src={songURL}
                preload="true"
                onLoadedMetadata={() => {
                    dispatch(setDuration(audioElement.current.duration));
                    clearInterval(interval);
                    interval=setInterval(updateCurrentTime, 500);
                }}
                ref={audioElement}
                hidden>
                Your browser does not support the
                <code>audio</code> element.
            </audio>
            <div className="flex flex-row flex-wrap md:flex-nowrap md:w-full w-full item-center">
                <p className="w-full md:w-46 font-mono text-xl bg-stone-900 rounded-lg p-4 text-white text-center mb-3 md:mb-0 shadow-md whitespace-nowrap overflow-hidden" >{songName}</p>
                <div className="flex flex-row w-full items-center md:ml-16">
                    <p className="text-right pr-4 " >{Math.floor(currentt/60)+":"+String(Math.floor(currentt-Math.floor(currentt/60)*60)).padStart(2,"0")}</p>
                    <div className="w-full flex flex-row  item-center">
                        <Slider aria-label="track_time" value={(currentt/durat)*100}  onChange={handleSliderChange} />
                    </div>
                    <p className="text-left pl-4" >{Math.floor(durat/60)+":"+String(Math.floor(durat-Math.floor(durat/60)*60)).padStart(2,"0")}</p>
                </div>
                <div className="flex flex-row w-full items-center justify-center">
                    <IconButton sx={{padding:0.5,marginRight:2}} onClick={handlePrevClick}>
                        <SkipPreviousIcon sx={{height:30,width:30}} className="text-black" />
                    </IconButton>
                    <IconButton sx={{padding:0.5}}>
                        {playing
                            ?<PauseCircleOutlineIcon sx={{height:40,width:40}} className="text-black" onClick={onPlayClick}/>
                            :<PlayCircleOutlineIcon sx={{height:40,width:40}} className="text-black" onClick={onPlayClick}/>}
                    </IconButton>
                    <IconButton sx={{padding:0.5,marginLeft:2}} onClick={handleNextClick}>
                        <SkipNextIcon sx={{height:30,width:30}} className="text-black" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default Player;
