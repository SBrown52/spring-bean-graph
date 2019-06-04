import React from 'react';
import './App.css';
import AtlasGraph from './Graph';
import 'antd/dist/antd.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Spring Bean Viewer</h1>
      </header>
      <AtlasGraph/>
    </div>
  );
}

export default App;
