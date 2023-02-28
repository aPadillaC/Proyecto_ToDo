import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { TaskContext } from '../Context/TasksProvider';

export const BasicModal = ({show, setShow, children}) => {
  
    const {condition, setCondition} = useContext(TaskContext);

    const handleClose = () => {

      setShow(false);
      setCondition(0);
    } 
    
  
    return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header>
      <Modal.Title>{condition === 1 ? "Registro de tarea" : condition === 2 ? "Edita la tarea" : condition === 3 && "Tarea Eliminada" }</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {children}
    </Modal.Body>
  </Modal>
  )
}