import './App.css';
import Home from './Home.js';
import Secret from './Secret.js';
import Resume from './Resume.js';
import React, { useEffect } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  useEffect(() => {
    document. title = "Jake Armendariz"
  }, [])

  return (
      <Router>
      <div>
        <Switch>
          <Route path="/secret">
            <Secret />
          </Route>
          <Route path="/resume">
            <Resume />
          </Route>
          <Route path="/">
            <div style={{backgorundColor:'black', overflow: 'hidden', margin: 0}}>
              <Home />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
