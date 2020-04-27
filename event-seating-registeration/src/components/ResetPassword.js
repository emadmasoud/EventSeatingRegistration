import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
export default class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      c_password: '',
      loginClicked: false,
      password_error_class: '',
      email: '',
      fgpass: ''
    }
  }

  componentDidMount = () => {
    let path = this.props.location.search;
    const urlParams = new URLSearchParams(path);
    let email = urlParams.get('email');
    let fgpass = urlParams.get('fgpass');
    let token = localStorage.getItem("fgpass");
    if (token && token == fgpass) {
      this.setState({ email, fgpass });
    }
    else {
      swal({
        title: "Invalid Request",
        text: "Please Try agin to reset your password by clicking on Forgot Password in Login Screen",
      }).then(ok => {
        if (ok) {
          this.props.history.push("/login")
        }
      })
    }

  }

  onFormValueChangeHandler = (e) => {
    let text = e.target.value;
    let name = e.target.name;
    this.setState({ [name]: text });
    let error_msg = '';
    if ((name == "c_password" && text != this.state.password) || (name == "password" && text != this.state.c_password)) {
      error_msg = 'is-invalid'
    }

    this.setState({ password_error_class: error_msg });
  }


  checkValidations = () => {

    var { c_password, password, email } = this.state;
    if (email != null && password.trim() != "" && c_password.trim() != "") {
      return true;
    }
    return false;


  }

  ResetPassword = e => {
    e.preventDefault();

    if (!this.checkValidations()) {
      ToastsStore.warning("Fill the required information please")
      return;
    }

    let user = {
      password: this.state.password,
      email: this.state.email


    };
    this.setState({ loginClicked: true });
    axios.post(BASE_URL + "resetPassword",
      user).then(data => {
        console.log(data)
        if (data.data.success) {
          swal({
            title: "Password Reset Successfully",
            text: "Please Try to Login with New Password",
          }).then(ok => {
            if (ok) {
              this.props.history.push("/login")
            }
          })
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




  registrationForm() {
    return <div>
      <form>
        <h3>Forgot Password</h3>
        <Row>
          <Col>
            <div className="form-group">
              <label>Password</label>
              <input type="password"
                required
                className={"form-control " + this.state.password_error_class}
                placeholder="Enter Password"
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
                placeholder="Re-enter Password"
                value={this.state.c_password}
                name='c_password'
                onChange={this.onFormValueChangeHandler} />
            </div>
          </Col>

        </Row>

        <button type="submit" className="btn btn-primary btn-block mt-3" disabled={(this.state.password == '' && this.state.c_password) || this.state.loginClicked} onClick={this.ResetPassword}>Reset Password</button>

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
