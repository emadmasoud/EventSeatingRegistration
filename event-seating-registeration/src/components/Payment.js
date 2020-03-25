import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { ToastsStore } from 'react-toasts';
import { connect } from 'react-redux';
import DataService from "../services/dataService";
import Header from './Header';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import PaystackButton from 'react-paystack';
export class Payment extends Component {
    constructor(props) {
        super(props);
        let eventLS = JSON.parse(localStorage.getItem('selected_event'));
        let user = JSON.parse(sessionStorage.getItem('user'));
        console.log(user, "USER")
        this.state = {
            //
            key: process.env.PUBLIC_KEY, //PAYSTACK PUBLIC KEY
            email: user.user.email,  // customer email
            amount: 1, //equals NGN100,
            //
            userData: user
        }
    }



    callback = (response) => {
        console.log(response); // card charged successfully, get reference here
    }

    close = () => {
        console.log("Payment closed");
    }

    componentWillMount() {
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user) {
            this.props.history.push("/login");
        }
    }

    getReference = () => {
        //you can put any unique reference implementation code here
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

        for (let i = 0; i < 15; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    render() {


        return (
            <div>
                <Header></Header>


                <div className="seat-picker-container">
                    <div className="m-3">
                        <PaystackButton
                            text="Pay for Tables"
                            className="payButton"
                            callback={this.callback}
                            close={this.close}
                            disabled={true}
                            embed={true}
                            reference={this.getReference()}
                            email={this.state.email}
                            amount={this.state.amount}
                            paystackkey={this.state.key}
                            tag="button"
                            quantity="10"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected_event: state.Event.selected
    };
}

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);