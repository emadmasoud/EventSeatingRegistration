import React, { Component } from 'react'
import { Nav, Navbar, NavItem, NavLink} from 'react-bootstrap';
import SeatPicker from 'react-seat-picker'
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import DataService from '../services/dataService';
import axios from 'axios';
export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
        userName: '',
        isAdmin: false
     
    }
  }

  componentWillMount(){
    let user =  JSON.parse(sessionStorage.getItem("user"));
    if(!user ||  !user.exist  )
    {
       window.location.href = "/login"
    }
    else 
    {
        this.setState({userName: user.user.first_name, isAdmin: user.user.isAdmin})
    }
  }
 
  signOut =()=>
  {
      let e  = [];
    sessionStorage.clear();
    window.location.href = "/login"
  }

  gotoCreateEventPage = () => {
    window.location.href = "/createEvent"

  }


  render() {

    return (
        <Navbar>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-start">
          <Navbar.Text>
            Signed in as: <a href="#login">{this.state.userName}</a>
          </Navbar.Text>  
        
      
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
        {this.state.isAdmin?   <NavLink onClick={this.gotoCreateEventPage}>
            Create Event
        </NavLink>:'' }  
         <NavLink onClick={() => window.location.href = "/events"}>
            Show All Events
        </NavLink>   
        <NavLink onClick={this.signOut}>
            Log Out
        </NavLink>   
        </Navbar.Collapse>
       
      </Navbar>
    )
  }
}
