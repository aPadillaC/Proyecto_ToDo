import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EditTask } from '../components/EditTask';
import { NavBar } from '../components/NavBar';
import { MainPage } from '../pages/Main';
import "./style.scss"

export const AppRoutes = () => {

  const [show, setShow] = useState(false);

  return (
    <BrowserRouter>
      <NavBar setShow={setShow}/>

      <Routes>
        <Route path='/' element={<MainPage 
          show={show} setShow={setShow}
        />}/>
      </Routes>
    </BrowserRouter>
        
  )
}
