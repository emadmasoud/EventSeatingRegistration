import React, { Component } from 'react'

import { Card, Image, Icon, Container, Grid, GridRow, GridColumn } from 'semantic-ui-react';
import SeatPicker from './SeatPicker';
import axios from 'axios';
import { BASE_URL } from './Config'
import { Redirect } from 'react-router-dom';
export default class EventList extends Component {
    constructor(props) {
        super(props);

    }

    render() {


        return (
            <GridColumn onClick={()=>this.props.goToTablePicker(this.props.event)}>
                <Card >
                {/* <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} /> */}
                <Card.Content>
                    <Card.Header>{this.props.event.name}</Card.Header>
                    <hr />
                    <Card.Meta>Date:  {this.props.event.date}</Card.Meta>
                    <Card.Meta>Time:  {this.props.event.time}</Card.Meta>
                    <Card.Meta>Location: {this.props.event.location}</Card.Meta>
                    <Card.Description>
                        The event description will be written here.
                      </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='table' />
                        {this.props.event.no_of_tables} Tables available
                      </a>
                </Card.Content>
            </Card></GridColumn>
        )
    }
}