import React, { Component } from 'react'
import { Grid, Card, Image, Icon, Dropdown } from 'semantic-ui-react';
import { connect } from "react-redux";
import DataService from "../../services/dataService";
import Header from '../Header';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import EventManagement from './EventManagement';



class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

                paidUsers: 0,
                availableTables: 0,
                registeredTables: 0,
                reservedTables:0,
      
            adminEvents: [],
            adminEventsOptions: [],
            users: [],
            selectedEventId:0,
            selectedEvent:{id:0},
            allRegisteredUsers:[]

        }
    }

    updateCount=(event)=>
    {
        console.log("UPDATE INFO CALLED")
        DataService.Instance.fetchAllEvents().then(evList => {
                
            event = evList.filter(ev=> ev.id == event.id)[0];
            DataService.Instance.fetchPaidUsers(event.id).then(users => {
            
                this.setState({
                    selectedEvent:event,
                    selectedEventId: event.id,
                    paidUsers: users.length,
                    availableTables: event.available_tables,
                    reservedTables: event.no_of_tables - event.available_tables
                  })
            })

        })
       
    }
    componentWillMount() {
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user || user.isAdmin == false) {
            this.props.history.push("/login");
        } else {

            

            DataService.Instance.fetchAllEvents().then(evList => {
                
                let options = evList.map(e => {
                    return {
                        key: e.id,
                        text: e.name,
                        value: e.id,
                        label: e.isActive? { color: 'green', empty: true, circular: true }:{ color: 'red', empty: true, circular: true }
                  
                    }
                });

                this.setState({ adminEventsOptions: options , adminEvents: evList})
            })

            DataService.Instance.fetchUsers().then(evList => {
                this.setState({ allRegisteredUsers: evList})
            })

         

        }
    }

    handleChange = (e, { value }) => {
        
       
        let event = this.state.adminEvents.filter(ev=> ev.id == value)[0];


        this.updateCount(event)
    
    }

    render() {



        return (
            <div className="">
                <Header></Header>

                <Grid style={{ textAlign: 'center',marginLeft: '70px' }}>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Dropdown
                                placeholder='Select Event to see details'
                                fluid
                                selection
                                options={this.state.adminEventsOptions}
                                style={{width:'400px'}}
                                onChange={this.handleChange}                        
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column md={3}>
                            <Card className="dashboard-card" >
                                {/* <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} /> */}
                                <Card.Content>
                                    <Card.Description>
                                        <h1>{this.state.availableTables}</h1>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        Available Tables
                      </a>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column md={3}>
                            <Card className="dashboard-card">
                                {/* <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} /> */}
                                <Card.Content>
                                    <Card.Description>
                                        <h1>{this.state.paidUsers}</h1>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        Paid Users
                      </a>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column md={3}>
                            <Card className="dashboard-card">
                                {/* <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} /> */}
                                <Card.Content>
                                    <Card.Description>
                                        <h1>{this.state.reservedTables}</h1>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        Total Reserved/Assigned Tables
                      </a>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        
                    </Grid.Row>

                    <Grid.Row columns={'sixteen'}>
                     
                        {this.state.selectedEventId?
                        <EventManagement event={this.state.selectedEvent}  allUsers={this.state.allRegisteredUsers} updateCount={this.updateCount}></EventManagement>:''
                        }
                        
                      
                    </Grid.Row>
                   
                </Grid>


            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    };
}



export default connect(mapStateToProps, {})(Dashboard);