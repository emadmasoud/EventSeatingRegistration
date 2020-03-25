import React, { Component } from 'react'

import { Card, Image, Icon, Container, Grid, GridRow, GridColumn } from 'semantic-ui-react';
export default class EventList extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let date = new Date(this.props.event.date);
        return (
            <GridColumn onClick={()=>this.props.goToTablePicker(this.props.event)}>
                <Card >
                {/* <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} /> */}
                <Card.Content>
                    <Card.Header>{this.props.event.name}</Card.Header>
                    <hr />
                    <Card.Meta>Date:  {date.toLocaleDateString("en-US")}</Card.Meta>
                    <Card.Meta>Time:  {this.props.event.time}</Card.Meta>
                    <Card.Meta>Location: {this.props.event.location}</Card.Meta>
                    <Card.Description>
                        The event description will be written here.
                      </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='table' />
                        {this.props.event.available_tables} Tables available out of {this.props.event.no_of_tables}
                      </a>
                </Card.Content>
            </Card></GridColumn>
        )
    }
}