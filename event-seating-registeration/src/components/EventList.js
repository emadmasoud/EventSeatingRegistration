import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react';
import Event from './Event';
import { connect } from "react-redux";
import DataService from "../services/dataService";
import { selectEvent } from '../redux/actions/EventActions';
import Header from './Header';
import swal from '@sweetalert/with-react';
import { Toast } from 'react-bootstrap';
import { ToastsStore } from 'react-toasts';
import { PaystackButton, usePaystackPayment } from 'react-paystack';

class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventsList: [],
            selected_event: null,
            userObj: null,
            purchaseQuantity:0
        }
    }

    componentWillMount() {
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user) {
            this.props.history.push("/login");
        } else {
            DataService.Instance.fetchEvents().then(data => {
                this.setState({ eventsList: data, userObj: user })
            });
        }
    }

    getAllTables(event) {
        return new Promise((resolve, reject)=>{
            DataService.Instance.fetchTables(event.id).then(t_list => {
                event['tables_list'] = t_list;
                this.props.selectEvent(event);
                resolve(true);
            });
        }) 
    }


    goToTableSelection = event => {
        DataService.Instance.getPaidTablesInfo(this.state.userObj.id, event.id).then(data=>{
            if(data.status === undefined)
                this.notPaid(event);
            else if(data.status === 'PAID' || data.status === 'COMPLETED')
                this.AlreadyPaid(event);
          })
    }



    AlreadyPaid = event =>{      
        this.getAllTables(event).then(res=>{
            this.props.history.push('/seatPicker');
        });    
    }


    notPaid = event =>{
        this.getAllTables(event); 
        swal("How many tables do you want to reserve?", {
            content: "input",
        })
            .then((value) => {
               
                var no_of_tables = Number(value);
                if (isNaN(no_of_tables) || no_of_tables=="" || no_of_tables==null || no_of_tables < 0 ) {
                    ToastsStore.error("Enter valid number");
                }
                else if (no_of_tables > event.available_tables) {
                    ToastsStore.error("Sorry! Cant reserve more than available table");
                }
                else {

                    this.setState({ purchaseQuantity: no_of_tables });

                    let paystackConfig = {
                        text: "Proceed",
                        className: "swal-button swal-button--success",
                        onSuccess: (res) => this.callback(res),
                        onClose:  () => this.close(),
                        reference: (new Date()).getTime(),
                        email: this.state.userObj.email,
                        amount: no_of_tables * event.cost_per_table,
                        publicKey: "pk_test_472b5a2bd8cbdd2774d1e1fe78c3051569daeccd",
                        channels: ['bank', 'card', 'mobile_money', 'qr', 'ussd']
                    }

                    swal({
                        icon: 'warning',
                        text: `Your total would be ${no_of_tables * event.cost_per_table} NGN`,
                        buttons: {
                            cancel: "Cancel"
                        },
                        content:(
                           <PaystackButton {...paystackConfig} ></PaystackButton>
                        )
                    })
                }
            });
    }



    callback = (response) => {
        console.log(response, "CALLBACK"); // card charged successfully, get reference here
        // call the api for setting the total payable seats of aS user with event information 
        // close the modal 
        var userID = this.state.userObj.id;
        var eventID = this.props.selected_event.id; 
        var noOfTables = this.state.purchaseQuantity;

        console.log(userID, eventID, noOfTables, "GOING FAAAAAAAAAR PAYMENT JANI")

        DataService.Instance.paymentConfirmed(userID, eventID, noOfTables).then(res=>{
            swal.close();
            this.props.history.push('/seatPicker');
        })
       
    }

    close = () => {
        console.log("Payment closed");
        
    }

    render() {
      


        return (
            <div className="">
                <Header></Header>
                <Grid className="justify-content-center">
                    {this.state.selected_event == null &&
                        this.state.eventsList.map(event => {
                            return <Event event={event} goToTablePicker={this.goToTableSelection}></Event>
                        })
                    }
                  
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected_event: state.Event.selected
    };
}



export default connect(mapStateToProps, { selectEvent })(EventList);