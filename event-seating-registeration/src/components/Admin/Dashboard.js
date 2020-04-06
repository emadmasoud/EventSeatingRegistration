import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react';
import { connect } from "react-redux";
import DataService from "../../services/dataService";
import Header from '../Header';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
    }

    componentWillMount() {
        let user = JSON.parse(sessionStorage.getItem("user")).user;
        if (!user || user.isAdmin == false) {
            this.props.history.push("/login");
        } else {
           
        }
    }


    render() {
      


        return (
            <div className="">
               <Header></Header>

                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        
    };
}



export default connect(mapStateToProps, { })(Dashboard);