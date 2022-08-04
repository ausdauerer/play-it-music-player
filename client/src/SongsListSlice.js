import {createSlice} from "@reduxjs/toolkit";
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

const initialState={
    currentSongIndex:0,
    songs:[]
};

export const fetchSongs = createAsyncThunk('SongsList/fetchSongs', 
    async () => {
    const response = await axios.get('/allTracks')
    return response.data
})

const SongsListSlice=createSlice({
    name:"SongsList",
    initialState:initialState,
    reducers:{
        setCurrentSongIndex:(state,action)=>{
            state.currentSongIndex=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchSongs.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchSongs.fulfilled, (state, action) => {
            state.songs=action.payload;
            console.log(action.payload);
            state.status = 'idle'
          })
    }
});

export const {setCurrentSongIndex} = SongsListSlice.actions;

export default SongsListSlice.reducer;