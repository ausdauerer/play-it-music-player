import {configureStore} from "@reduxjs/toolkit";
import PlayerReducer from "./PlayerSlice";
import logger from 'redux-logger'
import SongsListReducer from './SongsListSlice';

const reducer={
    player:PlayerReducer,
    SongsList:SongsListReducer
}
const store=configureStore({
    reducer:reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;