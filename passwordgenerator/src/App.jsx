import React, { useEffect } from 'react'
import { useState, useCallback } from 'react';
function App() {

  const [length, setLength] = useState(8);
  const [numAllow, setNumAllow] = useState(false);
  const [charAllow, setCharAllow] = useState(false);
  const [password, setPassword] = useState("");
  
  const passwordGen = useEffect(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(numAllow) str += "0123456789"
    if(charAllow) str += "!@#$%"

    for(let i=0; i<=Array.length; i++ {
      
    }
  }, [length, numAllow, charAllow, setPassword]);
  return (
   <> 
   <div>
    <h1>Password Generator</h1>
   </div>

   </>
  )
}

export default App;