import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import Hero from './components/Hero'
import Signin from './components/Signin'
import AppLayout from './components/layout/AppLayout'
import AddMember from './components/AddMember'
import About from './components/About'
import Dashboard from './components/Dashboard'
import Signup from './components/Register'
import Reminder from './components/Reminder'
import Records from './components/Records'
import Insights from './components/Insights'
import Features from './components/Features'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
function App() {
  const router = createBrowserRouter([
    {
      path:'/',
      element:  <AppLayout/>,
      children:[
        {
          path: '/',
          element: <Hero/>,
        },
        {
          path:'/login',
          element:<Signin/>,
        },
        {
          path:'/addmember',
          element:<AddMember/>,
        },
        {
          path:'/about',
          element:<About/>,
        },{
          path:'/dashboard',
          element:<Dashboard/>,
        },{
          path:'/signup',
          element:<Signup/>,
        },{
          path:'/reminder',
          element:<Reminder/>,
        },{
          path:'/records',
          element:<Records/>,
        },
        {
          path:'/insights',
          element:<Insights/>,
        },
         {
          path:'/features',
          element:<Features/>,
        },
      ],
    },
    
  ]);
  return <RouterProvider router={router}/>;

  
}

export default App