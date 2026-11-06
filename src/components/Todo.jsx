
import { useState, useMemo } from "react";

export default function Todo(props) {
    const [todoSearch, setTodoSearch] = useState("");
    const [todotext, setTodotext] = useState("");
    const [todoID, setTodoID] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [todos, setTodos] = useState([
        { id: 1, title: "Learn React", status: true },
        { id: 2, title: "Build a Todo App", status: false },
    ]);

    const [todoButton, setTodoButton] = useState("Add");

    // Add and Update Todo
    const handleAddTodo = () => {
        if (!todotext.trim()) return;

        if (todoButton === "Add") {
            const obj = {
                id: Date.now(),
                title: todotext,
                status: false,
            };

            setTodos((prevTodos) => [...prevTodos, obj]);
        } else {
            const updatedTodos = todos.map((todo) =>
                todo.id === todoID
                    ? { ...todo, title: todotext }
                    : todo
            );

            setTodos(updatedTodos);
            setTodoID(null);
            setTodoButton("Add");
        }

        setTodotext("");
    };

    // Delete Todo
    const handleDelete = (id) => {
        setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== id)
        );

        if (todoID === id) {
            setTodoID(null);
            setTodoButton("Add");
            setTodotext("");
        }
    };

    // Edit Todo
    const handleEdit = (todo) => {
        setTodotext(todo.title);
        setTodoID(todo.id);
        setTodoButton("Update");
    };

    // Complete / Pending Todo
    const handleComplete = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id
                ? { ...todo, status: !todo.status }
                : todo
        );

        setTodos(updatedTodos);
    };

    // Search Todo
    const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
        const matchesSearch = todo.title
            .toLowerCase()
            .includes(todoSearch.toLowerCase());

        const matchesFilter =
            activeFilter === "All" ||
            (activeFilter === "Completed" && todo.status) ||
            (activeFilter === "Pending" && !todo.status);

        return matchesSearch && matchesFilter;
    });
}, [todos, todoSearch, activeFilter]);

    return (
        <div className="container">
            <h1>{props.title}</h1>

            {/* Search Input */}
            <div className="todoInput">
                <input
                    type="text"
                    placeholder="Search your todos..."
                    value={todoSearch}
                    onChange={(e) => setTodoSearch(e.target.value)}
                />
            </div>

            <div className="filter-buttons">
                <button onClick={() => setActiveFilter("All")}>All</button>

                <button onClick={() => setActiveFilter("Completed")}>
                    Completed
                </button>

                <button onClick={() => setActiveFilter("Pending")}>
                    Pending
                </button>
            </div>

            {/* Add / Update Input */}
            <div className="todoInput">
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={todotext}
                    onChange={(e) => setTodotext(e.target.value)}
                />

                <button onClick={handleAddTodo}>
                    {todoButton}
                </button>
            </div>

            {/* Todo List */}
            {filteredTodos.map((todo) => (
                <div className="todo-card" key={todo.id}>
                    <div className="wrapper-container">
                        <input
                            className="checkboxInput"
                            type="checkbox"
                            checked={todo.status}
                            onChange={() => handleComplete(todo.id)}
                        />

                        <div className="todo-card-content">
                            <h1 className={todo.status ? "completed" : ""}>
                                {todo.title}
                            </h1>

                            <div className="todo-card-buttons">
                                <button onClick={() => handleEdit(todo)}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(todo.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {filteredTodos.length === 0 && (
                <p>No todos found!</p>
            )}
        </div>
    );
}
