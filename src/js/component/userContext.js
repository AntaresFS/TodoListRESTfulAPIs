import React, { createContext, useState } from "react";

// Crear el contexto
export const UserContext = createContext();

// Crear un proveedor del contexto
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(""); // Estado para almacenar el username
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas

    return (
        <UserContext.Provider value={{ username, setUsername, tasks, setTasks }}>
            {children}
        </UserContext.Provider>
    );
};
