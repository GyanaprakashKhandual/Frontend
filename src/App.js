import React from 'react'
import './App.css'
import { useState, useEffect } from 'react';

function App() {

  const [counter, setCounter] = useState(0);
  const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 5000); // hide after 5 seconds
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);
  
  const addValue = () => {
    setCounter(counter + 1);
  }

  const removeValue = () => {
    setCounter( counter - 1);
    if(counter <= 0) {
      setCounter(0);
      setShowAlert(true);
      return;
    }
  }

  if(setCounter === 0) {
    setCounter(0);
    alert('Can not go under the 0');
  }
  return (
    <>
    <h1>Count and Trace</h1>
    <h2>Counter Value: {counter}</h2>
    <button onClick={addValue}>Add Value +1</button>
    <button onClick={removeValue}>Remove Value -1</button>
    {showAlert && (
        <div className="custom-alert">
          <p>Cannot go below zero!</p>
        </div>
      )}
    </>
  )
}

export default App;

