import React, {useState} from 'react';
import {RiCloseCircleLine} from 'react-icons/ri';
import {TiEdit} from 'react-icons/ti';

function Todo({todos, completeTodo,guesses}) {

    
    return guesses.map((guess, index) => (
        <div>
            <div key={guess.id}>
                {guess.text}
            </div>
            
        </div>
    ))
}

export default Todo
