import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Task.css"; // Include the CSS for styling

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate?: string;
}

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [editTask, setEditTask] = useState<Partial<Task> | null>(null);
  const [message, setMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks", { headers });
      setTasks(response.data.tasks);
    } catch (error) {
      setMessage("Error fetching tasks.");
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post("http://localhost:3000/tasks", newTask, { headers });
      setTasks((prev) => [response.data.task, ...prev]);
      setNewTask({});
      setMessage("Task created successfully.");
    } catch (error) {
      setMessage("Error creating task.");
    }
  };

  const handleEditTask = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3000/tasks/${id}`, editTask, { headers });
      setTasks((prev) => prev.map((task) => (task.id === id ? response.data.task : task)));
      setEditTask(null);
      setMessage("Task updated successfully.");
    } catch (error) {
      setMessage("Error updating task.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`, { headers });
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setMessage("Task deleted successfully.");
    } catch (error) {
      setMessage("Error deleting task.");
    }
  };

  return (
    <div className="task-container">
      <h1>User Tasks</h1>
      {message && <p className="message">{message}</p>}

      {/* New Task Form */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title || ""}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTask.description || ""}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Priority"
          value={newTask.priority || ""}
          onChange={(e) => setNewTask({ ...newTask, priority: +e.target.value })}
        />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editTask?.id === task.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTask.title || ""}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                />
                <textarea
                  value={editTask.description || ""}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
                <button onClick={() => handleEditTask(task.id)}>Save</button>
                <button onClick={() => setEditTask(null)}>Cancel</button>
              </div>
            ) : (
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <button onClick={() => setEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;
