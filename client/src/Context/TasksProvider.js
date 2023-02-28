import React, { createContext, useEffect, useState } from 'react'
import axios from "axios";

export const TaskContext = createContext();

export const TasksProvider = (props) => {

    const [tasksList, setTasksList] = useState([]);
    const [reload, setReload] = useState(false);
    const [condition, setCondition] = useState(0);

    useEffect(() => {
      
        axios
            .get(`http://localhost:4000/tasks/allTask`)
            .then((res) => {
                setTasksList(res.data);
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })   
    
    }, [reload])
    
  return (
    <>
        <TaskContext.Provider value={{setTasksList, tasksList, reload, setReload, condition, setCondition}}>
            {props.children}
        </TaskContext.Provider>
    </>
  )
}
