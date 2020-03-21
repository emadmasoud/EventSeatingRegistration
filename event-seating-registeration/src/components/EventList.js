import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'; 
import Event from './Event';
import { connect } from "react-redux";
import DataService from "../services/dataService";
import { selectEvent } from '../redux/actions/EventActions';
class EventList extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            eventsList: [],
            selected_event: null
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.selected_event != null)
            this.props.history.push('/seatPicker');
    }

    componentWillMount() {
        DataService.Instance.fetchEvents().then(data=>{        
            this.setState({eventsList: data})
       });    
          
    }

    getAllTables(event) {
        DataService.Instance.fetchTables(event.id).then(t_list=>{   
            event['tables_list'] = t_list;              
            this.props.selectEvent(event);
       });    
    }

    goToTableSelection = event => {
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