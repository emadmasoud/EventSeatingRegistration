import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
        email:'',
      loginClicked:false
    }
  }


  onFormValueChangeHandler = (e) => {
    let text = e.target.value;
    let name = e.target.name;
    this.setState({ [name]: text });
  }


  checkValidations = () => {

    var { email, password } = this.state;
    if (
      email.trim() != '') {
      return true;
    }
    return false;


  }

  ForgotPassword = e => {
    e.preventDefault();
    
    if (!this.checkValidations()) {
      ToastsStore.warning("Fill the required information please")
      return;
    }
    let token = Math.floor((Math.random() * 1000000) + 1);
    localStorage.setItem("fgpass", token);
    let user = {
      email: this.state.email,
      token: token 

    };
    this.setState({ loginClicked: true });
    axios.post(BASE_URL + "forgotPassword",
      user).then(data => {
        console.log(data)
        if (data.data.success) {
        swal({
            title:"Password Reset Email Sent",
            text:"Please Reset your password with that link",
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


  goToTablePage = e => {
    return <Redirect to="/seatPicker"></Redirect>
  }

  registrationForm() {
    return <div>
      <form>
        <h3>Forgot Password</h3>
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
       
        <button type="submit" className="btn btn-primary btn-block mt-3" disabled={this.state.email == '' || this.state.loginClicked} onClick={this.ForgotPassword}>Send Verification Email</button>
       
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
