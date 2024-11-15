import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

function LoginPage() {
  const { username, setUsername, setTasks } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Estado para el estado de carga de tareas
  const [errorModal, setErrorModal] = useState(false); // Estado para mostrar el modal de error
  const navigate = useNavigate(); // Hook para redirigir programáticamente

  const checkUserExists = (username) => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((resp) => {
        console.log("Respuesta del servidor:", resp.status); // Ver el estado de la respuesta
        setLoading(false);
        if (resp.status === 404) {
          setErrorModal(true);
          console.log("El usuario no existe, mostrando modal."); // Ver si entra en esta condición
        } else if (resp.ok) {
          console.log("Usuario encontrado, redirigiendo..."); // Ver si entra en esta condición
          setLoading(true);
          return resp.json(); // Devolver la respuesta JSON para obtener las tareas
        } else {
          console.error("Error inesperado al verificar el usuario.");
        }
      })
      .then((data) => {
        if (data && data.todos) {
          setTasks(data.todos); // Guardar las tareas en el contexto
          navigate(`/todos/${username}`); // Redirigir a la página de tareas
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error en la solicitud:", error);
      });
  };

  const createUser = (username) => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]), // Inicializa el usuario con una lista vacía de tareas
    })
      .then((resp) => {
        if (resp.ok) {
          // Si el usuario se crea exitosamente, redirigir a la página de tareas
          setErrorModal(false);
          navigate(`/todos/${username}`); 
        } else {
          console.error("Error al crear el usuario");
        }
      })
      .catch((error) => console.error("Error al crear el usuario", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkUserExists(username);
  };

  return (
    <div className="todo-container">
      <h1 className="title">Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Introduzca su usuario"
          className="todo-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" className="todo-input">
          Aceptar
        </button>
      </form>

      {loading && (
        <div className="loading">
          <h3>Cargando tareas de {username}...</h3>
        </div>
      )}

      {errorModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>El usuario "{username}" no existe</h2>
            <p>¿Deseas crear este usuario?</p>
            <div className="d-flex justify-content-center">
              <button onClick={() => createUser(username)}>Sí</button>
              <button className="no" onClick={() => setErrorModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
