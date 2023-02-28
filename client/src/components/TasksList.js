import React, { useContext, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { TaskContext } from "../Context/TasksProvider";
import { FcCheckmark } from "react-icons/fc";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { GoEye } from "react-icons/go";
import { FaFlagCheckered } from "react-icons/fa";
import axios from "axios";
import { BasicModal } from "./BasicModal";
import { DeleteTaskMessage } from "./DeleteTaskMessage";
import { EditTask } from "./EditTask";
import "./componentsStyle.scss"


export const TasksList = () => {

    const {setTasksList, tasksList} = useContext(TaskContext);
    const [showMessage, setShowMessage] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [oneTask, setOneTask] = useState({});
    
    

    const {setReload, reload, setCondition} = useContext(TaskContext);



    const handlerEditTask = (id) => {

      axios
        .get(`http://localhost:4000/tasks/showOneTask/${id}`)
        .then((res) => {
          setOneTask(res.data);      
          console.log("oneTask", oneTask);
          setShowEdit(!showEdit);  
          setCondition(2);  
        })
        .catch((error) => {
          console.log(error);
        })
    }


    const deleteTask = (id) => {

      axios
        .delete(`http://localhost:4000/tasks/deleteTask/${id}`)
        .then((res) => {
          setReload(!reload);
          setShowMessage(true);
          setCondition(3);
        })
        .catch((error) => {
          console.log(error);
        })
    }



    const madeTask = (id) => {

      axios
        .put(`http://localhost:4000/tasks/madeTask/${id}`)
        .then((res) => {
          setReload(!reload);
        })
        .catch((error) => {
          console.log(error);
        })
    }

  return (
    <Row className="p-4 text-center">
      <Col>
        <Table className="border-dark tableList">
          <thead className="headTable">
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Título</th>
              <th scope="col">Descripción</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {tasksList.map((task, idx) => {
              return (
                <tr key={idx}
                  className={`${task.status ? "made" : ""}`}
                >
                  <th>{ idx +1 }</th>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  {!task.status ?
                  <td><GoEye 
                    onClick={() => handlerEditTask(task.id)}
                    style={{cursor: "pointer"}}
                  /></td>
                  :
                  <td><strong>(Realizada)</strong></td>
                  }
                   {!task.status ? 
                  <td><FcCheckmark 
                    onClick={() => madeTask(task.id)}
                    style={{cursor: "pointer"}}
                  /></td>
                  :
                  <td><FaFlagCheckered /></td>
                  }
                  <td><RiDeleteBin6Fill 
                    onClick={() => deleteTask(task.id)}
                    style={{cursor: "pointer"}}
                  /></td>                 
                </tr>
              );
            })}
          </tbody> 
        </Table>
        <BasicModal show={showEdit} setShow={setShowEdit}>
          <EditTask oneTask={oneTask} show={showEdit} setShow={setShowEdit}/>
        </BasicModal>
        <BasicModal show={showMessage} setShow={setShowMessage}>
          <DeleteTaskMessage/>
        </BasicModal>
      </Col>
    </Row>
  );
};
