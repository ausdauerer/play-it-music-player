import {createSlice} from "@reduxjs/toolkit";

const initialState={
    isPlaying:false,
    currentTime:0,
    duration:0,
    selectedSongURL:null,
    songName:"Select some song to play"
};

const PlayerSlice=createSlice({
    name:"player",
    initialState:initialState,
    reducers:{
        setIsPlaying:(state,action)=>{
            state.isPlaying=action.payload;
        },
        setCurrentTime:(state,action)=>{
            state.currentTime=action.payload;
        },
        setDuration:(state,action)=>{
            state.duration=action.payload;
        },
        setSelectedSongURL:(state,action)=>{
            state.selectedSongURL=action.payload;
            console.log(state.selectedSongURL);
        },
        fetchState:(state)=>{
            console.log("Fetched state")
        },
        setSongName:(state,action)=>{
            state.songName=action.payload;
        }
    }
});

export const {setIsPlaying,setCurrentTime,setDuration,setSelectedSongURL,fetchState,setSongName} = PlayerSlice.actions;

export default PlayerSlice.reducer;