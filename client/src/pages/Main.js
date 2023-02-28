import React from 'react'
import { Container } from 'react-bootstrap';
import { BasicModal } from '../components/BasicModal';
import { TaskForm } from '../components/TaskForm';
import { TasksList } from '../components/TasksList';
import "./main.scss"



export const MainPage = ({show, setShow}) => {

  return (
    <Container fluid className='mainPage'>

      <h1 className='text-center titleText'>Listado de tareas pendientes</h1>
    
      <TasksList/>
      <BasicModal show={show} setShow={setShow}>
          <TaskForm 
              setShow={setShow}
              show={show}
          />
      </BasicModal>
    

     </Container>
  )
}
