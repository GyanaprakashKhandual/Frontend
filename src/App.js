import React from 'react'
import './App.css'
import { useState } from 'react';

function App() {

  const [counter, setCounter] = useState(5);

  const addValue = () => {
    setCounter(counter + 1);
  }

  const removeValue = () => {
    setCounter( counter - 1);
  }
  return (
    <>
    <h1>Count and Trace</h1>
    <h2>Counter Value: {counter}</h2>
    <button onClick={addValue}>Add Value</button>
    <button onClick={removeValue}>Remove Value</button>
    </>
  )
}

export default App;

