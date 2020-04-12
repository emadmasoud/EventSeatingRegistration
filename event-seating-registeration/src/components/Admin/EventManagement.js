import React, { Component } from 'react'
import { Button, Segment, Modal, Dropdown } from 'semantic-ui-react';
import { connect } from "react-redux";
import DataService from "../../services/dataService";
import Header from '../Header';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import swal from 'sweetalert';

class EventManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allEventTables: [],
            filter_reserve: -1,
            is_reserve_filter_applied: false,

            // modal props
            modal: {
                open: false, 
                data:{
                    number: '',
                    area:'',
                    table_id: 0
                },
                selected_userID:0
            },
            allUsers: this.props.allUsers,
            allUsersOptions: this.props.allUsers.map(e=>{
                    return {
                        key: e.id,
                        text: `${e.first_name} ${e.last_name} (${e.email})`,
                        value: e.id
                    }
            })


        }
    }

    
    close = () => {
        this.setState({modal: { ...this.state.modal,
              open: false ,
              data:{number:'', area:''}
            }})
    }

    componentWillMount() {
        console.log("WILL MOUNT", this.props.event.name)
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user || user.isAdmin == false) {
            this.props.history.push("/login");
        }
        else {
            DataService.Instance.fetchTables(this.props.event.id).then(tables => {
                console.log("EVENT MANAGEMENT", this.props.event, tables)
                this.setState({ allEventTables: tables })
            }).catch(err => {
                console.log("EVENT MANAGEMENT", err, this.props.event)
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.event.id != this.props.event.id) {
            this.setState({
                allEventTables: [],
                filter_reserve: -1,
                is_reserve_filter_applied: false, 
                allUsers: this.props.allUsers,
                allUsersOptions: this.props.allUsers.map(e=>{
                        return {
                            key: e.id,
                            text: `${e.first_name} ${e.last_name} (${e.email})`,
                            value: e.id
                        }
                })

            })
            DataService.Instance.fetchTables(this.props.event.id).then(tables => {
                console.log("EVENT MANAGEMENT", this.props.event, tables)
                this.setState({ allEventTables: tables })
            }).catch(err => {
                console.log("EVENT MANAGEMENT", err, this.props.event)
            })
        }

    }

    openModalWithData = (data) => {
        console.log(data, "Row data")
        this.setState({modal: {...this.state.modal, open:true, data:data}})
    }

    reserveTableForUser = () =>{

        let toBeReservedTableList = {
            event_id: this.props.event.id,
            user_id: this.state.modal.selected_userID,
            table_id: this.state.modal.data.id, 
            number: this.state.modal.data.number,
            area: this.state.modal.data.area,
          };
        var data = {
            eventID: this.props.event.id,
            tables: [toBeReservedTableList]
          }
          console.log(data)
          DataService.Instance.reserveTables(data).then(data=>{      
          

            DataService.Instance.fetchTables(this.props.event.id).then(tables => {
                this.setState({ allEventTables: tables })
                this.close();
                swal({
                    title: "Reserved!",
                    text: "Reservation Email has also been sent!",
                    icon: "success",
                 
                  })
                this.props.updateCount(this.props.event);
            }).catch(err => {
            })

            
          }); 
    }


    handleChange = (e, { value }) => {
              
       this.setState({modal:{...this.state.modal, selected_userID:value}})
    
    }


    render() {
        const { open, dimmer } = this.state.modal;

        console.log("RENDER", this.props.event.name)
        let filteredRes = this.state.allEventTables.filter(u => u.isReserved == this.state.filter_reserve);
        let filtered = !this.state.is_reserve_filter_applied ? this.state.allEventTables : filteredRes;

        return (
            <div className="">

                <Segment className="table-container-dashboard" >

                    <ReactTable
                        minRows={0}
                        filterable={true}
                        columns={[
                            {
                                Header: 'Event',
                                accessor: 'event_id',
                                Cell: (row) => {
                                    return (<div>{this.props.event.name}</div>)
                                },
                                filterable: false
                            },
                            {
                                Header: 'Area',
                                accessor: 'area',
                            },
                            {
                                Header: 'Table Number',
                                accessor: 'number',
                                filterable: false
                            },
                            {
                                Header: 'Reserved',
                                accessor: 'isReserved',

                                Cell: (row) => {
                                    return (<div style={row.original.isReserved ? { color: 'green' } : { color: 'red' }} value={row.original.isReserved ? "Yes" : "No"}> {row.original.isReserved ? "Yes" : "No"}</div>)
                                },
                                Filter: (cellInfo) => ( // Used to render the filter UI of a filter-enabled column
                                    <select style={{ width: '100%' }} onChange={event => { this.setState({ filter_reserve: event.target.value, is_reserve_filter_applied: event.target.value != -1 ? true : false }) }} value={this.state.filter_reserve}>
                                        <option value={-1}>All</option>
                                        <option value={1}>Yes</option>
                                        <option value={0}>No</option>
                                    </select>
                                    // The value passed to onFiltersChange will be the value passed to filter.value of the filterMethod
                                )


                            },
                            {
                                Header: 'User',
                                accessor: 'user_id',
                                Cell: (row) => {
                                    return (<div> {row.original.user_id ? row.original.user_id : <Button primary content="Assign User" onClick={() => this.openModalWithData(row.original)}></Button>}</div>)
                                },

                            }

                        ]}
                        data={filtered}
                        showPagination={true}
                        defaultPageSize={100}

                        className="-highlight" />






                    {/*_________________________ M O D A L _______________________________________ */}
                    <Modal dimmer={'blurring'} open={open} onClose={this.close}>
                        <Modal.Header>{`Reserve Table ${this.state.modal.data.number} in area ${this.state.modal.data.area} for User`}</Modal.Header>
                        <Modal.Content>
                            <div>
                            <Dropdown
                                placeholder='Select User'
                                fluid
                                selection
                                options={this.state.allUsersOptions}
                                style={{width:'400px'}}
                                onChange={this.handleChange}                        
                            />
                            </div>
                       
                        
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.close}>
                                Cancel
                            </Button>
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Reserve"
                                onClick={this.reserveTableForUser}
                            />
                        </Modal.Actions>
                    </Modal>
                </Segment>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    };
}



export default connect(mapStateToProps, {})(EventManagement);



