import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import SeatPicker from 'react-seat-picker'
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import DataService from '../services/dataService';
import axios from 'axios';
export default class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  componentWillMount(){
    let user =  sessionStorage.getItem("user");
    if(user)
    {
        this.props.history.push("/events");
    }
  }

  onFormValueChangeHandler = (e) => {
    let text = e.target.value;
    let name = e.target.name;
    this.setState({ [name]: text });
  }

  registerUser = e => {
    e.preventDefault();
    let user = {
      email: this.state.email,
      password: this.state.password

    };

    axios.post(BASE_URL + "login", 
    user).then(data => {
     console.log(data)
     if (data.data.success) {
       ToastsStore.success("Successfully Logged In!")
       sessionStorage.setItem("user", JSON.stringify(data.data.data));
       this.props.history.push("/events");
     }
     else {
       ToastsStore.error(data.data.message)
       this.setState({ showSeatPickerButton: false })
     }
   }).catch(err => {
     console.log(err)
     ToastsStore.error("Something went wrong! Try Again..")
     this.setState({ showSeatPickerButton: false })
   })
  
  }

  
  goToTablePage = e =>{
    return <Redirect to="/seatPicker"></Redirect>
  }

  registrationForm(){
   return  <div>
    <form>
      <h3>Login</h3>
      <Row>
        <Col>
          <div className="form-group">
            <label>Email address</label>
            <input type="email"
              required
              className="form-control"
              placeholder="Enter email"
              value={this.state.email}
              name='email'
              onChange={this.onFormValueChangeHandler} />
          </div>
        </Col>
       
      </Row>
      <Row>
      <Col>
          <div className="form-group">
            <label>Password</label>
            <input type="password"
              required
              className={"form-control " + this.state.password_error_class}
              placeholder="Enter password"
              value={this.state.password}
              name='password'
              onChange={this.onFormValueChangeHandler} />
          </div>


        </Col>
        </Row>


      <button type="submit" className="btn btn-primary btn-block mt-3"  disabled={this.state.email=='' && this.state.password==''} onClick={this.registerUser}>Login</button>
      <p className="forgot-password text-right">
        No Account?  <span className="clickable" onClick={()=> this.props.history.push("/register")}>sign up?</span>
      </p>
    </form>

  </div>
  }


  render() {
    const pageContent = this.registrationForm();

    return (
      <div>
       {pageContent}
      </div>
    )
  }
}
