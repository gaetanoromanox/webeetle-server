import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import './App.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Login';
import ErrorPage from './ErrorPage';
import Dashboard from './admin/Dashboard';
import Client from './user/Client';
import Register from './Register';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement : <ErrorPage />
  },
  {
    path: "/register",
    element: <Register />,
    errorElement : <ErrorPage />
  },
  {
    path: "/admin",
    element: <Dashboard />,
    errorElement : <ErrorPage />
  },
  {
    path: "/user",
    element: <Client />,
    errorElement : <ErrorPage />
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
