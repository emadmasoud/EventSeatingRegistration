import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';

import { ToastsStore } from 'react-toasts';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import Header from '../Header';
import DatePicker from "react-datepicker";
import CurrencyInput from 'react-currency-input-field'
import "react-datepicker/dist/react-datepicker.css";
import DataService from '../../services/dataService';
export default class CreateEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            location: '',
            date_time:new Date(),
            expiration_date: '',
            no_of_tables: "120",
            available_tables: '',
            cost_per_table: '',
            errors: {
                name: '',
                location: '',
                date_time: '',
                expiration_date: '',
                no_of_tables: '',
                available_tables: '',
                cost_per_table: ''
            }

        }
    }
    componentDidMount() {

    }


    isValid = text => {
        text = text.trim()
        return text != '' && text != null && text != undefined;
    }

    onDateTimeChange = (text, name) => {

        this.setState({ [name]: text });

    }
    onFormValueChangeHandler = (e) => {

        let text = e.target.type != "checkbox" ? e.target.value : e.target.checked;
        let name = e.target.name;
        let isCheckbox = e.target.type != "checkbox" ? false : true;
        this.setState({ [name]: text, errors:{...this.state.errors, [name]:''} });
    }

    checkValidations = () => {
    

            var { name, location, date, time , expiration_date, no_of_tables, available_tables, cost_per_table } = this.state;
            if (name.trimLeft().trimRight() != "" &&
                location.trimLeft().trimRight() != "" &&
                date != "" &&
                time != "" &&
                expiration_date != ""
                 && no_of_tables != "" 
                 && available_tables != "" 
                 && cost_per_table != "" ) {
                return true;
            }
            if(available_tables > no_of_tables)
            {
               this.setState({errors: {...this.state.errors, available_tables:'Available tables cant be more than total Tables'}})
            }
            return false;
      
    }


    CreateEvent = e => {
        e.preventDefault();
        if (!this.checkValidations()) {
            ToastsStore.warning("Enter the required fields please.")
            return;
        }

        let event = {
            name: this.state.name.trimLeft().trimRight(),
            location: this.state.location.trimLeft().trimRight(),
            date: this.state.date_time.toISOString().slice(0, 10),
            time: new Date(this.state.date_time).toTimeString().split(" ")[0],
            expiration_date: this.state.expiration_date.toISOString().slice(0, 10),
            no_of_tables: this.state.no_of_tables,
            available_tables: this.state.available_tables,
            cost_per_table: this.state.cost_per_table

        };

        console.log("EVENT IS READY BABY", event)

        DataService.Instance.createEvent(event).then(res => {
            console.log(res,"data ")
            if (res.success) {
                ToastsStore.success("Event Created Successfully")
                this.props.history.push("/events")
            }
        })

    }



    CreateEventForm() {
        return <div>
            <form>
                <h3>Event Creation</h3>

                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Name</label>
                            <span class="required">*</span>
                            <input type="text"
                                required
                                className="form-control"
                                placeholder="Event Name"
                                value={this.state.name}
                                name='name'
                                onChange={this.onFormValueChangeHandler} />
                            <div class="required small">{this.state.errors.name}</div>
                        </div>
                    </Col>


                </Row>


                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Location</label>
                            <span class="required">*</span>
                            <input type="email"
                                required
                                className="form-control"
                                placeholder="Location"
                                value={this.state.location}
                                name='location'
                                onChange={this.onFormValueChangeHandler} />
                            <div class="required small">{this.state.errors.location}</div>
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Date</label>
                            <DatePicker
                                className="form-control"
                                selected={this.state.date_time}
                                showTimeSelect
                                value={this.state.date_time}
                                onChange={(date) => this.onDateTimeChange(date, 'date_time')}
                                timeFormat="HH:mm aa"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()}
                                placeholderText="Click to select a date for event"
                                isClearable
                                withPortal
                            />
                            <div class="required small">{this.state.errors.date_time}</div>
                        </div>

                    </Col>


                </Row>

                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Expiry Date</label>
                            <span class="required">*</span>
                            <DatePicker
                                className="form-control"
                                selected={this.state.expiration_date}
                                value={this.state.expiration_date}
                                onChange={(date) => this.onDateTimeChange(date, 'expiration_date')}
                                minDate={new Date().setDate(new Date(this.state.date_time).getDate())}
                                placeholderText="Click to select a date for event"
                                dateFormat="MMMM d, yyyy"
                                isClearable
                                withPortal
                            />
                        </div>
                        <div class="required small">{this.state.errors.expiration_date}</div>

                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Cost per Table</label>
                            <CurrencyInput
                                id="input-example"
                                name="cost_per_table"
                                placeholder="Enter Cost"
                                className="form-control"
                                prefix={"NGN   "}
                                allowDecimals={true}
                                decimalsLimit={2}
                                onChange={(value, name) => { this.onFormValueChangeHandler({ target: { type: 'text', name: name, value: value } }) }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Total Tables</label>
                            <span class="required">*</span>
                            <input type="text"
                                required
                                className={"form-control "}
                                placeholder="Total Tables"
                                value={this.state.no_of_tables}
                                name='no_of_tables'
                                readOnly
                            />
                        </div>


                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Available Tables</label>
                            <input type="number"
                                required
                                max={this.state.no_of_tables}
                                min={0}
                                className={"form-control "}
                                placeholder="Available Tables"
                                value={this.state.available_tables}
                                name='available_tables'
                                onChange={this.onFormValueChangeHandler}
                            />
                        </div>
                    </Col>
                </Row>





                <button type="submit" className="btn btn-primary btn-block mt-3" onClick={this.CreateEvent}>Create</button>

            </form>

        </div>
    }


    render() {
        const pageContent = this.CreateEventForm();

        return (
            <div>
                <Header></Header>
                <div className="auth-wrapper">

                    <div className="auth-inner mt-5 mb-5">
                        {pageContent}
                    </div>
                </div>


            </div>
        )
    }
}
