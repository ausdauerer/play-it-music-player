import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import {Provider} from "react-redux";
import { Routes, Route, Link, Navigate,BrowserRouter as Router} from "react-router-dom";
import {createMemoryHistory} from 'history';
import Login from './Login';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token=cookies.get("TOKEN");

const root = ReactDOM.createRoot(document.getElementById('root'));
const history = createMemoryHistory();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router  location={history.location} navigator={history}>
        <Routes>
        <Route exact path="/home" element={token? <App /> :<Navigate replace to="/login" />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<Navigate replace to="/home" />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
