import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Switch} from "react-router";
import Home from "./components/Home";
import Login from "./containers/Login";
import Logout from "./containers/Logout";

function App() {
  return (
      <div>
        <main role="main" className="container">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
          </Switch>
        </main>
      </div>
  );
}

export default App;
