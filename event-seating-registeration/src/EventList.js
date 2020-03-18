import React, { Component } from 'react'

// import { Row, Col, Container } from 'react-bootstrap';
import { Card, Image, Icon, Container, Grid, GridRow, GridColumn } from 'semantic-ui-react';
import SeatPicker from './SeatPicker';
import Event from './Event';
import axios from 'axios';
import { BASE_URL } from './Config'
export default class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventsList: [],
            selected_event: null
        }
    }

    componentWillMount() {
        axios.get(BASE_URL + "events").then(response => {
            if (response.data.success) {
                let list = response.data.data;
                list = list.concat([...response.data.data])
                list = list.concat([...response.data.data])
                list = list.concat([...response.data.data])
                console.log(list.length)
                this.setState({ eventsList: list })
            }
        })
    }

    getAllTables(event) {
        let t_list = []
        const params = {
          eventID: event.id
        };
    
        axios.get(BASE_URL + "getTables", { params }).then(response => {
          if (response.data.success) {
            t_list = response.data.data.map(ele => {
              ele['isReserved'] = ele['isReserved'] == 0 ? false : true;
              return ele;
            })
            
            event['tables_list'] = t_list

            if (this.state.selected_event != null && event.id == this.state.selected_event.id)
                this.setState({ selected_event: null });
            else
                this.setState({ selected_event: event })
          }



        })
    
    
    
      }

    goToTableSelection = event => {
        console.log(event);
        this.getAllTables(event);
      
    }


    render() {
        return (
            <div className="">
                <Grid className="justify-content-center">
                    {this.state.selected_event == null &&
                        this.state.eventsList.map(event => {
                            return <Event event={event} goToTablePicker={this.goToTableSelection}></Event>
                        })
                    }
                </Grid>

            {this.state.selected_event != null? <SeatPicker event={this.state.selected_event}></SeatPicker>: null }
            </div>
        )
    }
}