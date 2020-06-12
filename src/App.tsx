import React from 'react';
import './App.css';
import {Route, Switch} from "react-router";
import Home from "./components/Home";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import Register from "./authentication/Register";
import DelegateListOverview from "./DelegateListOverview/DelegateListOverview";
import TopNavigation from "./components/TopNavigation";
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter as Router} from "react-router-dom";
import Profile from "./profile/Profile";
import DAppCreate from "./dapp/DAppCreate";
import DelegateCreate from "./delegate/DelegateCreate";
import DelegateUpdate from "./delegate/DelegateUpdate";
import DAppUpdate from "./dapp/DAppUpdate";
import DAppOfferDetails from "./dapp/DAppOfferDetails";
import Chat from "./chat/Chat";

const App = () => (
    <div>
        <Provider store={store}>
            <Router>
                <TopNavigation/>
                <main role="main" className="container">
                    <Switch>
                        <Route path='/profile/:id' component={Profile}/>
                        <Route path='/dappoffer/:id'>{DAppOfferDetails}</Route>
                        <Route path='/delegate-overview' component={DelegateListOverview}/>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/logout' component={Logout}/>
                        <Route exact path='/' component={Home}/>
                        <Route path='/create-dapp' component={DAppCreate}/>
                        <Route path='/create-delegate' component={DelegateCreate}/>
                        <Route path='/update-delegate/:id' component={DelegateUpdate}/>
                        <Route path='/update-dapp/:id' component={DAppUpdate}/>
                        <Route path='/chat' component={Chat} />
                    </Switch>
                </main>
            </Router>
        </Provider>
    </div>
);

export default App;
