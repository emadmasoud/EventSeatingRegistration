import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import SeatPicker from 'react-seat-picker'
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import DataService from '../services/dataService';
import axios from 'axios';
export default class RegistrationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      c_password: '',
      class_no: 'MBA2018',
      agreed: false,
      password_error_class: '',
      showSeatPickerButton: false,
      classOptionsList: []
    }
  }
  componentDidMount()
  {
    this.getClassOptionsList();
  }

getClassOptionsList(){
  DataService.Instance.getClasses().then(classes=>{
    console.log(classes,"classes")
    this.setState({classOptionsList: classes.data})
  })
}

  onFormValueChangeHandler = (e) => {
    let text = e.target.type != "checkbox" ? e.target.value : e.target.checked;
    let name = e.target.name;
    let error_msg = this.state.password_error_class
    console.log(name, text, e)
    if ((name == "c_password" && text != this.state.password) || (name == "password" && text != this.state.c_password)) {
      error_msg = 'is-invalid'
    }
    else {
      error_msg = ''
    }
    this.setState({ [name]: text, password_error_class: error_msg });
  }

  registerUser = e => {
    e.preventDefault();
    let user = {
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      class_no: this.state.class_no,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password

    };
    axios.post(BASE_URL + "register", 
     user).then(data => {
      console.log(data)
      if (data.data.success) {
        ToastsStore.success("Successfully Registered! Please Login")
        this.props.history.push("/login");
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
    // return <Redirect to="/seatPicker"></Redirect>
  }

  registrationForm(){
   return  <div>
    <form>
      <h3>Sign Up</h3>

      <Row>
        <Col>
          <div className="form-group">
            <label>First name</label>
            <input type="text"
              required
              className="form-control"
              placeholder="First name"
              value={this.state.first_name}
              name='first_name'
              onChange={this.onFormValueChangeHandler} />
          </div>
        </Col>
        <Col>
          <div className="form-group">
            <label>Middle name</label>
            <input type="text"
              required
              className="form-control"
              placeholder="Middle name"
              value={this.state.middle_name}
              name='middle_name'
              onChange={this.onFormValueChangeHandler} />
          </div>
        </Col>
        <Col>
          <div className="form-group">
            <label>Last name</label>
            <input type="text"
              required
              className="form-control"
              placeholder="Last name"
              value={this.state.last_name}
              name='last_name'
              onChange={this.onFormValueChangeHandler} />
          </div>
        </Col>
      </Row>


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
        <Col>
          <div className="form-group">
            <label>Phone No.</label>
            <input type="number"
              required
              className="form-control"
              placeholder="Enter phone number"
              value={this.state.phone}
              name='phone'
              onChange={this.onFormValueChangeHandler} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Class</label>
            <select
              required
              className="form-control"
              name='class_no'
              value={this.state.class_no}
              onChange={this.onFormValueChangeHandler}
            >

            {this.state.classOptionsList.map(op=>{
              return <option value={op}>{op}</option>
            })}
            </select>
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
        <Col>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password"
              required
              className={"form-control " + this.state.password_error_class}
              placeholder="Enter password"
              value={this.state.c_password}
              name='c_password'
              onChange={this.onFormValueChangeHandler}
            />
          </div>
        </Col>
      </Row>


      <span>
        <input type="checkbox"
          required
          checked={this.state.agreed}
          name='agreed'
          onChange={this.onFormValueChangeHandler} />
        <span className="forgot-password text-left"> I agree to the <a href="#"> Terms & Conditions</a> mentioned by Event Planners</span>

      </span>


      <button type="submit" className="btn btn-primary btn-block mt-3" disabled={(!this.state.agreed || this.state.password_error_class != '')} onClick={this.registerUser}>Register</button>
      <p className="forgot-password text-right">
        Already registered <span className="clickable" onClick={()=> this.props.history.push("/login")}>sign in?</span>
      </p>
    </form>

  </div>
  }


  render() {
    const pageContent =  this.registrationForm();

    return (
      <div>
       {pageContent}
      </div>
    )
  }
}
