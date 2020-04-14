import React, { Component } from 'react'
import { Grid, GridRow, GridColumn, Button, Container } from 'semantic-ui-react';
import { connect } from "react-redux";
import DataService from "../../services/dataService";
import Header from '../Header';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import {ConvertJSONtoCSV} from "easy-json-to-csv-converter";



class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: this.getPaidUsersInfo(),
            roleFilter: '-1',
            roleFilterApplied: false

        }
    }

    getPaidUsersInfo = () =>{
        let all =  this.props.allUsers? this.props.allUsers: [];
        let paid = this.props.allPaidUsers? this.props.allPaidUsers:[];

        let final = [];
        all.forEach(element => {
            paid.forEach(p_ele=>{
                if(element.id == p_ele.user_id)
                   {
                       element['reserved_tables'] = p_ele['reserved_tables'];
                       element['event'] = this.props.event.name
                       final.push(element);
                   }
            })
        });

        return final;

    }
    componentWillMount() {
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user || user.isAdmin == false) {
            this.props.history.push("/login");
        } else {
          
        }
    }

    exportUsers = () =>
    {
        let fileName = "Registered_Users_Data";
        let fileNameMode = 2; 
        let showLabels = true;
        let users = this.state.allUsers.filter(u=>u.isAdmin==0);
        users = users.map(u=>{
            u.isAdmin = u.isAdmin? "Admin":"User";
            delete u.password;
            return u;
        })

        let mappedColumns = [
            { key: "id", value: "User ID" },
            { key: "first_name", value: "First Name" },
            { key: "middle_name", value: "Middle Name" },
            { key: "last_name", value: "Last Name" },
            { key: "email", value: "Email Address" },
            { key: "phone", value: "Contact Number" },
            { key: "class", value: "Class" },
            { key: "isAdmin", value: "Role" }
          ];

        ConvertJSONtoCSV(users, fileName, fileNameMode, showLabels,mappedColumns );
    }




    render() {

        let filteredUsers = this.state.allUsers.filter(u => u.isAdmin == this.state.roleFilter);
        let filtered = !this.state.roleFilterApplied ? this.state.allUsers : filteredUsers;

        return (
            <div className="">
                {/* <Header></Header> */}
                
                <Container className="table-container">
                <Grid>
                    <GridRow>
                        <GridColumn>
                            <Button  content='Export as CSV' primary onClick={this.exportUsers}/>
                        </GridColumn>
                    </GridRow>
                </Grid>
                    <ReactTable
                        minRows={0}
                        filterable={true}
                        columns={[
                            {
                                Header: 'Event',
                                accessor: 'event',
                            },
                            {
                                Header: 'User ID',
                                accessor: 'id',
                            },
                            {
                                Header: 'First Name',
                                accessor: 'first_name',
                            },
                            {
                                Header: 'Middle Name',
                                accessor: 'middle_name',
                            },
                            {
                                Header: 'Last Name',
                                accessor: 'last_name',
                            },
                            {
                                Header: 'Email',
                                accessor: 'email'
                            },
                            {
                                Header: 'Contact #',
                                accessor: 'phone',

                            },
                            {
                                Header: 'Class',
                                accessor: 'class',

                            },
                            {
                                Header: 'Reserved Tables',
                                accessor: 'reserved_tables',

                            },
                            {
                                Header: 'Role',
                                accessor: 'isAdmin',
                                filterMethod: (filter, row, column) => {
                                    const id = filter.pivotId || filter.id
                                    console.log(filter, row, column, "METHOD")
                                    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true
                                },
                                Cell: (row) => {
                                    return (<div style={row.original.isAdmin ? { color: 'blue' } : { color: 'green' }} value={row.original.isAdmin ? "Admin" : "User"}> {row.original.isAdmin ? "Admin" : "User"}</div>)
                                },
                                Filter: (cellInfo) => ( // Used to render the filter UI of a filter-enabled column
                                    <select onChange={event => { this.setState({ roleFilter: event.target.value, roleFilterApplied: event.target.value != -1 ? true : false }) }} value={this.state.roleFilter}>
                                        <option value={-1}>All</option>
                                        <option value={0}>User</option>
                                        <option value={1}>Admin</option>
                                    </select>
                                    // The value passed to onFiltersChange will be the value passed to filter.value of the filterMethod
                                )

                            }
                        ]}
                        data={filtered}
                        showPagination={true}
                        defaultPageSize={5}

                        className="-highlight" />


                </Container>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    };
}



export default connect(mapStateToProps, {})(UserManagement);



