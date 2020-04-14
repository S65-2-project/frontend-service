import React from 'react';
import './App.css';
import {Route, Switch} from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import TopNavigation from "./components/TopNavigation";
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter as Router} from "react-router-dom";

function App() {
    return (
        <div>
            <Provider store={store}>
                <Router>
                    <TopNavigation/>
                    <main role="main" className="container">
                        <Switch>
                            <Route exact path='/' component={Home}/>
                            <Route path='/login' component={Login}/>
                            <Route path='/register' component={Register}/>
                            <Route path='/logout' component={Logout}/>
                        </Switch>
                    </main>
                </Router>
            </Provider>
        </div>
    );
}

export default App;
