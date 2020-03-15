import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import SeatPicker from './SeatPicker';

export default class EventList extends Component {
constructor(props)
{
    super(props);
    this.state = {
        eventsList: [],
        selected_event: null
    }
}

    goToTableSelection = event =>{
        console.log(event);
        if(this.state.selected_event != null && event.id == this.state.selected_event.id)
            this.setState({selected_event: null});
        else
            this.setState({selected_event: event})
    }


    render() {
        let eventsList = [{ id:1, name: "abc0", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200", available_tables:100 },
        { id:2, name: "abc1", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200" ,available_tables:100},
        {id:3, name: "abc2", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200" ,available_tables:100},
        { id:4,name: "abc3", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200",available_tables:100 },
        { id:5,name: "abc4", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200" ,available_tables:100}
            , { id:6,name: "abc5", location: "California", date: "3/20/2020", time: "03:00", expiration_date: "3/16/202", no_of_tables: 100, cost_per_table: "200" ,available_tables:100}];
        return (
            <div>
                {this.state.selected_event == null && eventsList.map(ev => {
                    return <Card onClick={() => this.goToTableSelection(ev)}>
                        Name: {ev.name}                  
                    </Card>
                })}

                {this.state.selected_event != null? <SeatPicker event={this.state.selected_event}></SeatPicker>:""}
            </div>
        )
    }
}