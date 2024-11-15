import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./userContext";
import { FaTrash } from "react-icons/fa";
import { LuPenSquare } from "react-icons/lu";


function Home() {
    const { tasks = [], setTasks, username } = useContext(UserContext); 
    const [inputValue, setInputValue] = useState(''); // Para almacenar el valor de la nueva tarea
    const [hasError, setHasError] = useState(false); // Para manejar errores
    const [errorMsg, setErrorMsg] = useState(''); // Para mostrar mensajes de error

    // Función para crear una nueva tarea y sincronizar con la API
    const handleKeyUp = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const newTask = { label: inputValue, is_done: false };
            
            fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            })
            .then(resp => resp.json())
            .then(data => {
                setTasks([...tasks, data]); // Actualiza las tareas locales
                setInputValue(''); // Resetea el input
            })
            .catch(() => {
                setHasError(true);
                setErrorMsg("Error al crear la tarea.");
            });
        }
    };

    // Función para eliminar una tarea individual
    const handleDelete = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            // Actualiza las tareas locales después de eliminar
            setTasks(tasks.filter(task => task.id !== id));
        })
        .catch(() => {
            setHasError(true);
            setErrorMsg("Error al eliminar la tarea.");
        });
    };

    // Función para eliminar todas las tareas
    const handleDeleteAll = () => {
        tasks.forEach(task => {
            fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .catch(() => {
                setHasError(true);
                setErrorMsg("Error al eliminar todas las tareas.");
            });
        });
        // Limpia la lista localmente
        setTasks([]);
    };

    return (
        <div className="todo-container">
            <h1 className="title">Todos</h1>
            <div className="todo-list">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    className="todo-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={handleKeyUp}
                />
                <ul className="todo-items">
                    {hasError ? (
                        <li className="no-tasks">{errorMsg}</li>
                    ) : tasks.length === 0 ? (
                        <li className="no-tasks">No hay tareas. Añada sus tareas.</li>
                    ) : (
                        tasks.map((task) => (
                            <li key={task.id} className="todo-item">
                                {task.label}
                                <button className="btn" onClick={() => handleDelete(task.id)}><FaTrash /></button>
                            </li>
                        ))
                    )}
                </ul>
                <div className="items-left">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} left</div>
                <button className=" todo-input" onClick={handleDeleteAll}>
                    Eliminar todas las tareas
                </button>
            </div>
        </div>
    );
}

export default Home;