import Home from './Home.js';
import Secret from './Secret.js';
import Colors from './Colors.js';
import Resume from './Resume.js';
import Strava from './Strava.js';
import React, { useEffect } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  useEffect(() => {
    document.title = "Jake Armendariz"
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
          <Route path="/strava">
            <Strava />
          </Route>
          <Route path="/colors">
            <Colors />
          </Route>
          <Route path="/">
            <div style={{backgroundColor:'black', overflow: 'hidden', margin: 0}}>
              <Home />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
