import React, { useContext } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { TaskContext } from '../Context/TasksProvider';


export const NavBar = ({setShow}) => {

  const {setCondition} = useContext(TaskContext);

  const showForm = () => {

    setShow(true);
    setCondition(1);
  }

  return (
    <Row>
        <Col  className='navBarColour p-3 d-flex justify-content-center'>
            <Button 
              className='buttonColourNavBar'
              onClick={showForm}
              >Insertar Tarea</Button>
        </Col>
    </Row>
  )
}
