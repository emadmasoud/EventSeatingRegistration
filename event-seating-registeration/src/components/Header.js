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
        userName: ''
     
    }
  }

  componentWillMount(){
    let user =  JSON.parse(sessionStorage.getItem("user"));
    if(!user)
    {
       window.location.href = "/login"
    }
    else 
    {
        this.setState({userName: user.user.first_name})
    }
  }
 
  signOut =()=>
  {
      let e  = [];
    sessionStorage.clear();
    window.location.href = "/login"
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
        <NavLink onClick={this.signOut}>
            Log Out
        </NavLink>   
        </Navbar.Collapse>
       
      </Navbar>
    )
  }
}
