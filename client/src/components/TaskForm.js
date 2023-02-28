import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { TaskContext } from '../Context/TasksProvider';


const initialValue = {
    title: "",
    description: ""
}

export const TaskForm = ({show, setShow}) => {

    const [message, setMessage] = useState(false);
    const [task, setTask] = useState(initialValue);

    const {setTasksList, setCondition} = useContext(TaskContext);



    const handlerChange = (e) => {

      setMessage(false);
        const {name, value} = e.target;

        setTask({...task, [name]: value});

        setMessage(false);
    }

    
    const onSubmit = (e) => {

        e.preventDefault();

        if(!task.title || !task.description){

          setMessage(true);
        }

        else{        

          axios
              .post(`http://localhost:4000/tasks/createTask`, task)
              .then((res) => {
                  console.log(res);
                  setTasksList(res.data);
                  setShow(!show);
              })
              .catch((error) => {
                  console.log(error);
              })

        }
    }



    const goBack = (e) => {

      e.preventDefault();

      setShow(!show);
      setCondition(0);

  }

    
  return (
    <>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Título de la tarea</Form.Label>
        <Form.Control 
            required
            autoFocus
            type="text" 
            placeholder="Introduce título"
            value={task?.title}
            name="title"
            onChange={handlerChange} 
        />       
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control 
            required
            type="text" 
            placeholder="Introduce descripción" 
            value={task?.description}
            name="description"
            onChange={handlerChange} 
        />
      </Form.Group>
      {message && <p className='text-danger'><strong>Debe de introducir todos los datos</strong></p>}
      <Button 
            className='me-4 buttonColour'
            type="submit"
            onClick={onSubmit}
        >Registrar
      </Button>
      <Button 
            className='ms-1 buttonCancel'
            type="submit"
            variant="danger" 
            onClick={goBack}
        >Cancelar
      </Button>
    </Form>
    
    
    
    </>
  )
}
