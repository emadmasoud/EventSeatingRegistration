import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import SeatPicker from 'react-seat-picker'
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import DataService from '../services/dataService';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
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
      classOptionsList: [],

      first_name_error: '',
      last_name_error: '',
      phone_error: '',
      email_error: '',
      password_error: ''
    }
  }
  componentDidMount() {
    this.getClassOptionsList();
  }


  isValid = text => {
    text = text.trim()
    return text != '' && text != null && text != undefined;
  }

  getClassOptionsList() {
    DataService.Instance.getClasses().then(classes => {
      console.log(classes, "classes")
      this.setState({ classOptionsList: classes.data })
    })
  }

  validate(text, name, isCheckbox) {
    let error_msg = this.state.password_error_class

    if (name == "password" && /\s/.test(text)) {
      let variable = `${name}_error`;
      this.setState({ [variable]: "Password cant contain space" })
    }
    else if (!isCheckbox && !this.isValid(text) && name != 'middle_name') {
      let variable = `${name}_error`;
      this.setState({ [variable]: "This field is required" })
    }
    else {
      let variable = `${name}_error`;
      this.setState({ [variable]: "" })
    }

    if ((name == "c_password" && text != this.state.password) || (name == "password" && text != this.state.c_password)) {
      error_msg = 'is-invalid'
    }
    else {
      error_msg = ''
    }
    this.setState({ password_error_class: error_msg });
  }

  onFormValueChangeHandler = (e) => {
    let text = e.target.type != "checkbox" ? e.target.value : e.target.checked;
    let name = e.target.name;
    let isCheckbox = e.target.type != "checkbox" ? false : true;
    this.validate(text, name, isCheckbox)
    this.setState({ [name]: text });
  }

  checkValidations = () => {
    var { first_name_error, middle_name_error, last_name_error, phone_error, email_error, password_error } = this.state;
    if (first_name_error == "" &&
      last_name_error == "" &&
      phone_error == "" &&
      email_error == "" &&
      password_error == "") {

      var { first_name, middle_name, last_name, phone, email, password, c_password } = this.state;
      if (first_name.trim() != "" &&
        last_name.trim() != "" &&
        phone.trim() != "" &&
        email.trim() != "" &&
        password.trim() != "" && c_password != "") {
        return true;
      }
      return false;
    }
    return false;
  }


  registerUser = e => {
    e.preventDefault();
    if (!this.checkValidations()) {
      ToastsStore.warning("Enter the required fields please.")
      return;
    }

    let user = {
      first_name: this.state.first_name.trim(),
      middle_name: this.state.middle_name.trim(),
      last_name: this.state.last_name.trim(),
      class_no: this.state.class_no.trim(),
      email: this.state.email.trim(),
      phone: this.state.phone.trim(),
      password: this.state.password.trim()

    };
    axios.post(BASE_URL + "register",
      user).then(data => {
        console.log(data)
        if (data.data.success) {
          axios.post(BASE_URL + "login",
            user).then(data => {
              console.log(data)
              if (data.data.success) {
                ToastsStore.success("Successfully Logged In!")
                sessionStorage.setItem("user", JSON.stringify(data.data.data));
                this.props.history.push("/events");
              }
              else {
                this.setState({ loginClicked: false });
                ToastsStore.error(data.data.message)
              }
            }).catch(err => {
              console.log(err)
              this.setState({ loginClicked: false });
              ToastsStore.error("Something went wrong! Try Again..")
            })
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



  registrationForm() {
    return <div>
      <form>
        <h3>Sign Up</h3>

        <Row>
          <Col>
            <div className="form-group">
              <label>First name</label>
              <span class="required">*</span>
              <input type="text"
                required
                className="form-control"
                placeholder="First name"
                value={this.state.first_name}
                name='first_name'
                onChange={this.onFormValueChangeHandler} />
              <div class="required small">{this.state.first_name_error}</div>
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
              <span class="required">*</span>
              <input type="text"
                required
                className="form-control"
                placeholder="Last name"
                value={this.state.last_name}
                name='last_name'
                onChange={this.onFormValueChangeHandler} />
              <div class="required small">{this.state.last_name_error}</div>
            </div>
          </Col>
        </Row>


        <Row>
          <Col>
            <div className="form-group">
              <label>Email address</label>
              <span class="required">*</span>
              <input type="email"
                required
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                name='email'
                onChange={this.onFormValueChangeHandler} />
              <div class="required small">{this.state.email_error}</div>
            </div>
          </Col>
          <Col>
            <div className="form-group">
              <label>Phone No.</label>
              <span class="required">*</span>
              <PhoneInput
                className="form-control"
                country={'us'}
                value={this.state.phone}
                onChange={phone => this.setState({ phone })}
              />
              <div class="required small">{this.state.phone_error}</div>
            </div>

          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <label>Class</label>
              <span class="required">*</span>
              <select
                required
                className="form-control"
                name='class_no'
                value={this.state.class_no}
                onChange={this.onFormValueChangeHandler}
              >

                {this.state.classOptionsList.map(op => {
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
              <span class="required">*</span>
              <input type="password"
                required
                className={"form-control " + this.state.password_error_class}
                placeholder="Enter password"
                value={this.state.password}
                name='password'
                onChange={this.onFormValueChangeHandler} />
            </div>
            <div class="required small">{this.state.password_error}</div>

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
          Already registered <span className="clickable" onClick={() => this.props.history.push("/login")}>sign in?</span>
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
