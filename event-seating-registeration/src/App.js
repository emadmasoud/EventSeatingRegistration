import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import RegistrationForm from "./RegistrationForm";
import TermsAndCondition from "./TermsAndCondition";
import SeatPicker from "./SeatPicker";
import EventList from "./EventList";
import { ToastsContainer, ToastsStore } from 'react-toasts';

function App() {
  return (<Router>
    <div className="App">
     <ToastsContainer store={ToastsStore}></ToastsContainer>

     <Switch>
     <Route exact path='/' component={TermsAndCondition} />
     <Route exact path="/seatPicker" component={SeatPicker} />    
     <Route exact path="/events" component={EventList} />    
      
      <div className="auth-wrapper">
        <div className="auth-inner">              
        <Route exact path="/register" component={RegistrationForm} />      
        </div>   
      </div>
     
      </Switch>
    </div></Router>
  );
}

export default App;