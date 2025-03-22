import { useState, useEffect } from "react";

const getDefaultLocalStorageValue = (key) => {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }
  try {
    return JSON.parse(storedValue);
  }
 catch {
  return null;
}
};

const useStickyState = (localStorageKey, defaultValue) => {
  const [state, setState] = useState(getDefaultLocalStorageValue(localStorageKey) ?? defaultValue);

  useEffect(() => {
    console.log(`Saving to localStorage (${localStorageKey}):`, state);
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [localStorageKey, state]);

  return [state, setState];
};


export default function App() {

  const [todos, setTodos] = useStickyState("ma-super-to-do-list",[
    {id: 1, text: "Learn React", checked: false}, 
    {id: 2, text: "Learn Tailwind", checked: true},
  ]);

  const [count, setCount] = useStickyState("count-save", 0);

  const  onFormAction = async (formData) => {
    const todo = formData.get("todo");
    setTodos([...todos, 
      {
        id: Date.now(), 
        text: todo,
        checked: false,
      },
    ]);
  }

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const updateTodoChecked = (id, newTodo) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          ...newTodo,
        };
      }
      return todo;
    }));
  }
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>Count: {count}</h1>
      <form action={onFormAction} className="flex items-center gap-2">
        <input name="todo" className="border rounded-md px-4 py-3 flex-1" />
        <button 
          type="submit"
          className="border rounded px-4 py-3 bg-zinc-500 text-white"
          onClick={() => setCount(count + 1)}
        >
        Add
      </button>
      </form>
      <ul className="flex flex-col gap-4">
        {todos.map((todo) => (
          <li key={todo.id} className="bg-zinc-200 px-4 gap-4 py-2 flex items-center">
            <input type="checkbox" checked={todo.checked} onChange={() => {
              updateTodoChecked(todo.id, {
                checked: !todo.checked,
              });
            }} />
            <span className="flex-1">{todo.text}</span>
            <button onClick={()=> deleteTodo(todo.id)} className="border border-zinc-800 rounded-md p-1 text-xs">🗑️</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

