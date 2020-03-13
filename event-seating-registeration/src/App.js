import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import RegistrationForm from "./RegistrationForm";
import SeatPicker from "./SeatPicker";
import { ToastsContainer, ToastsStore } from 'react-toasts';

function App() {
  return (<Router>
    <div className="App">
     <ToastsContainer store={ToastsStore}></ToastsContainer>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={RegistrationForm} />
            <Route path="/register" component={RegistrationForm} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;