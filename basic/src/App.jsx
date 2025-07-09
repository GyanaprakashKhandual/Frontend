import React from 'react'
import { useState, useEffect } from 'react';

function App() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/qa-projects')
    .then((res) => {
      if(!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then((data) => {
      setProjects(data);
      setLoading(false);
    })
    .catch((err) => {
      console.log('Error while fetching the data: ', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return(
      <div>
        <h1>Data Loading</h1>
      </div>
    )
  }

  return (
   <div>
    <h1>QA Projects</h1>
    <div>
      {projects.map((project, index) => (
        <li key={index}>
          <strong>{project.name}</strong>
        </li>
      ))}
    </div>
   </div>
  )
}

export default App;