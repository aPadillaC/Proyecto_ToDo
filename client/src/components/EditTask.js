import axios from 'axios';
import React, { useContext, useState } from 'react'
import { TaskContext } from "../Context/TasksProvider";
import { Button, Form } from 'react-bootstrap';
import "./componentsStyle.scss"


export const EditTask = ({show, setShow, oneTask, setCondition}) => {

    console.log("oneTask", oneTask);

    const [editTask, setEditTask] = useState(oneTask);
    const [showEditForm, setShowEditForm] = useState(false);

    const {setReload, reload} = useContext(TaskContext);


    const showForm = (e) => {

        e.preventDefault();

        setShowEditForm(!showEditForm);
    }



    const goBack = (e) => {

        e.preventDefault();

        setShow(!show);
        setCondition(0);

    }


    const handlerChange = (e) => {

        const {name, value} = e.target;

        setEditTask({...editTask, [name]: value});
    }



    const saveChanges = (e) => {

        e.preventDefault();

        axios
        .put(`http://localhost:4000/tasks/upDateTask/${editTask.id}`, editTask)
        .then((res) => {
          setEditTask(res.data);
          setShowEditForm(!showEditForm);
          setReload(!reload);
        })
        .catch((error) => {
            console.log(error);
        })
    }

  return (
    <>
    {!showEditForm ?
    <Form>
      <Form.Group className="mb-3">
        <p><strong>Título: </strong>{editTask.title}</p>       
      </Form.Group>
      <Form.Group className="mb-3">
        <p><strong>Descripción: </strong>{editTask.description}</p>
      </Form.Group>
      <Button 
            className='me-4 buttonColour'
            type="submit"
            onClick={showForm}
        >Editar
      </Button>
      <Button 
            className='ms-1 buttonCancel'
            variant="danger" 
            type="submit"
            onClick={goBack}
        >Volver
      </Button>
    </Form>
    :
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Título de la tarea</Form.Label>
        <Form.Control 
            autoFocus
            type="text" 
            placeholder="Introduce título"
            value={editTask?.title}
            name="title"
            onChange={handlerChange} 
        />       
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control 
            type="text" 
            placeholder="Introduce descripción" 
            value={editTask?.description}
            name="description"
            onChange={handlerChange} 
        />
      </Form.Group>
      <Button 
            className='me-4 buttonColour'
            variant="primary" 
            type="submit"
            onClick={saveChanges}
        >Guardar cambios
      </Button>
      <Button 
            className='ms-1 buttonCancel '
            variant="danger" 
            type="submit"
            onClick={goBack}
        >Cancelar
      </Button>
    </Form>
    }
    </>
  )
}
