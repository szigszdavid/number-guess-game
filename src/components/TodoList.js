import React, {useState, useEffect} from 'react'
import Todo from './Todo';
import TodoForm from './TodoForm'
import { proxy, useSnapshot, subscribe } from 'valtio'
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { bindProxyAndYMap } from "valtio-yjs";

let roomName
const ydoc = new Y.Doc();

const websocketProvider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  roomName,
  ydoc
);

const ymap = ydoc.getMap("messages.v1");
const state = proxy({ guesses: [], numberToGuess: Math.floor(Math.random() * 100) })
bindProxyAndYMap(state, ymap);


function useForceUpdate(){
    useEffect(() => {
        
        return () => {
          setValue({});
        };
    }, []);

    const [value, setValue] = useState(0); // integer state
    return () => setValue(Math.random() * 10); // update the state to force render
}

function TodoList() {

    subscribe(state, useForceUpdate())
    // Unsubscribe by calling the result

    const [input, setInput] = useState('');
    const [roomReady,SetRoomReady] = useState(false);
    
    const handleChange = e => {
        setInput(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();

        roomName = input;
        setInput('');

        SetRoomReady(true);
    }
    
    const [todos, setTodos] = useState([])
    
    const addTodo = todo => {

        const newTodos = [todo, ...todos];

        setTodos(newTodos);
        console.log(todo,...todos);

        todo.text = todo.text + decideWord(todo.text)
        state.guesses.push(todo) //decideWord(todo.text)
        console.log(state.guesses[state.guesses.length - 1]);
        //state.count = state.count + 1;
        //console.log("A count: " + state.count);
    }

    const completeTodo = id => {
        let updatedTodos = todos.map(todo => {
            if (!todo.id == id) {
                todo.isComplete = !todo.isComplete;
            }
            return todo;
        });

        setTodos(updatedTodos);
    }

        
    function decideWord(text)
    {
            
            if (parseInt(text) === state.numberToGuess) {
                console.log("itt");
                return (" (egyenlő)")
            }
            else if(parseInt(text) > state.numberToGuess)
            {
                console.log("kisebb");
                return (" (kisebb)");
            }
            else{
                console.log("nagyobb");
                return (" (nagyobb)");
            }
    }

    const updateNumber = () =>
    {
        state.guesses = []
        state.numberToGuess = Math.floor(Math.random() * 100)
        console.log("Ez a megoldás: " + state.numberToGuess);
    }
    return (
        !roomReady ? 
        <div className='roomCreateDiv'>
            <form className='todo-form' onSubmit={handleSubmit}>
                Adj meg egy szobanevet: 
                <input
                    type='text'
                    value={input}
                    name='text'
                    className='todo-input'
                    onChange={handleChange}
                />
                <button className='todo-button'>Küldés</button>
            </form>
        </div>
        :
        <div className='gameDiv'>
            <TodoForm onSubmit={addTodo} />
            <button onClick={updateNumber}>Új játék</button>
            <Todo todos={todos} completeTodo={completeTodo} guesses={state.guesses}/>
        </div>
        
    )
}

export default TodoList
