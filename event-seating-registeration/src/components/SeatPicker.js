import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import SeatPicker from 'react-seat-picker'
import { ToastsStore } from 'react-toasts';
import {connect} from 'react-redux';
import DataService from "../services/dataService";
import Header from './Header';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import swal from 'sweetalert';
class SeatPlanner extends Component {
  constructor(props) {
    super(props);
    let eventLS = JSON.parse(localStorage.getItem('selected_event'));
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.state = {
      loading: false,
      event: this.props.selected_event? this.props.selected_event: eventLS,
      tables_list: this.props.selected_event? this.props.selected_event.tables_list : eventLS.tables_list,
      selectedTablesCount: 0,
      selectedTables: [],
      maxReservableTables: user.user.paid_tables ? user.user.paid_tables : 0,
      rowCountPerArea: {
        'A': [8],
        'B': [4],
        'C': [4],
        'D': [6, 7, 7],
        'E': [6, 7, 7]
      }
    }
  }
  

  addSeatCallback = ({ row, number, id }, addCb) => {

    let totalTables = this.state.selectedTablesCount + 1;
    let selectedTables = this.state.selectedTables;
    if (totalTables <= this.state.maxReservableTables) {
      // await new Promise(resolve => setTimeout(resolve, 1500))
      console.log(`Added seat ${number}, row ${row}, id ${id}`)
      addCb(row, number, id)
      selectedTables.push({ row, number, id });

      this.setState({ loading: false, selectedTablesCount: totalTables })
    }
    else {
      // ToastsStore.error(`Sorry, You have paid for ${this.state.maxReservableTables} tables only`)
      swal({
        title: "Sorry!",
        text: "You can't reserve more tables.",
        icon: "warning",
     
      })
      .then(willDelete => {
        if (willDelete) {
          ToastsStore.error(`Pay for tables first to make reservation.`)
        }
      });

    }

  }



  removeSeatCallback = ({ row, number, id }, removeCb) => {

    let totalTables = this.state.selectedTablesCount - 1;
    let selectedTables = this.state.selectedTables;
    if (totalTables < 0)
      totalTables = 0;
    // await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Removed seat ${number}, row ${row}, id ${id}`)

    removeCb(row, number)
    let idx = this.state.selectedTables.findIndex(d=>{ return d.id == id});
    selectedTables.splice(idx,1);
    console.log(selectedTables,idx,  "selected")
    this.setState({ loading: false, selectedTablesCount: totalTables, selectedTables: selectedTables })

  }



  getAlignedTables(area, tableList) {
    let tablesPerArea = tableList.filter(t => { return t.area == area });
    let finalTableMap = [];
    let alignments = this.state.rowCountPerArea[area];
    let totalTables = tablesPerArea.length;

    if (alignments.length == 1) {
      let totalTablesPerRow = parseInt(totalTables / alignments[0]);
      let i = 1;
      let temp = [];
      tablesPerArea.forEach(element => {
        temp.push(element);
        if (i == alignments[0]) {
          finalTableMap.push(temp);
          temp = [];
          i = 1;
        }
        else {
          i = i + 1;
        }

      });
    }
    else {
      let temp = [];
      let checkSum = alignments.reduce((a, b) => a + b, 0)
      // if (checkSum == totalTables) {
        alignments.forEach(size => {
          temp = [];
          temp = tablesPerArea.splice(0, size);
          if(temp.length > 0 )
            finalTableMap.push(temp);
        })
      // }
    }
    return finalTableMap;
  }


  checkout = () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let toBeReservedTableList = []
    toBeReservedTableList = this.state.selectedTables.map(st =>{
      var obj = {
        event_id: this.state.event.id, 
        user_id: user.user.id,
        table_id: st['id'], 
        number: st['number'], 
        area: st['number'].split('-')[1]
      }
      return obj;
    })

    if(!toBeReservedTableList.length)
    {
        ToastsStore.warning("You can't proceed without selecting any table.")
        return;
    }

    var data = {
      eventID: this.state.event.id,
      tables: toBeReservedTableList
    }
    console.log(data)
    DataService.Instance.reserveTables(data).then(data=>{        
      swal({
        title: "Confirmed!",
        text: "Reservation Completed. Please check your email. We have emailed you the details",
        icon: "success",
     
      })
      .then(willRedirect => {
        if (willRedirect) {
          this.props.history.push("/events")
        }
      });
      
    });    

  }

  componentWillMount(){

    let user =  JSON.parse(sessionStorage.getItem("user")).user;
    if(!user)
    {
        this.props.history.push("/login");
    }
    else
    {
      DataService.Instance.getPaidTablesInfo(user.id, this.state.event.id).then(data=>{
        this.setState({maxReservableTables: data.paid_tables});
      })
    }
  }

  showMyTables = () => {
    var seats = document.getElementsByClassName("seat--reserved");
    console.log(seats)
  }


  render() {
    let rowsA = this.getAlignedTables("A", this.state.tables_list)

    let rowsB = this.getAlignedTables("B", this.state.tables_list)

    let rowsC = this.getAlignedTables("C", this.state.tables_list)

    let rowsD = this.getAlignedTables("D", this.state.tables_list)

    let rowsE = this.getAlignedTables("E", this.state.tables_list)

    console.log(rowsD)

    return (
      <div>
          <Header></Header>
        
     
      <div className="seat-picker-container">
        <Row className="text-center">
          <Col> <h3>{this.state.event.name}</h3></Col>
        </Row>
        <Row className="text-center">
          <Col> <h5>Here is the visual table map of the venue. Please select the tables to reserve them. Thank You.</h5></Col>
        </Row>
        <Row></Row>
        <hr></hr>
        <Row>
          <Col>Available Tables <span className="available-seats-color-hint"></span></Col>
          <Col>Reserved Tables <span className="reserved-seats-color-hint"></span></Col>
          <Col>Selected Tables <span className="selected-seats-color-hint"></span></Col>
          <Col>You can select only {this.state.maxReservableTables - this.state.selectedTablesCount}  tables</Col>
       
         
        </Row>
        <hr />
        <div className="container">
          <Row>
            <Col>

              <div className="area-D" style={{ marginTop: '20px', float: 'left' }}>
                <h4>Area D</h4>
                <SeatPicker

                  addSeatCallback={this.addSeatCallback}
                  removeSeatCallback={this.removeSeatCallback}
                  rows={rowsD}
                  maxReservableSeats={this.state.event.no_of_tables}
                  selectedByDefault
                  loading={false}
                  tooltipProps={{ multiline: true }}
                />
              </div>
            </Col>
            <Col xs={5}>
             
              <div className="stage">
              Stage
              </div>
              <span className="band">Band</span>
              <div className="dance-floor">
                  Dance Floor
              </div>
              
            </Col>
            <Col>
              <div className="area-E" style={{ marginTop: '20px', float: 'right' }}>
                <h4>Area E</h4>
                <SeatPicker
                  addSeatCallback={this.addSeatCallback}
                  removeSeatCallback={this.removeSeatCallback}
                  rows={rowsE}
                  maxReservableSeats={this.state.event.no_of_tables}
                  selectedByDefault
                  loading={false}
                  tooltipProps={{ multiline: true }}
                />
              </div>
            </Col>
          </Row>
          <Row>
           <Col className="walkway-horizontal"> W A L K W A Y </Col>
           <Col  xs={5}></Col>
           <Col className="walkway-horizontal"> W A L K W A Y  </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <div className="area-B" style={{ marginTop: '20px', float: 'left' }}>
                <h4>Area B</h4>
                <SeatPicker
                  addSeatCallback={this.addSeatCallback}
                  removeSeatCallback={this.removeSeatCallback}
                  rows={rowsB}
                  maxReservableSeats={this.state.event.no_of_tables}
                  selectedByDefault
                  loading={false}
                  tooltipProps={{ multiline: true }}
                />
              </div>
            </Col>
            <Col xs={1} className="walkway-vertical">
            W A L K W A Y
            </Col>
            <Col>
              <div className="area-A" style={{ marginTop: '20px' }}>
                <h4>Area A</h4>
                <SeatPicker
                  addSeatCallback={this.addSeatCallback}
                  removeSeatCallback={this.removeSeatCallback}
                  rows={rowsA}
                  maxReservableSeats={this.state.event.no_of_tables}
                  selectedByDefault
                  loading={false}
                  tooltipProps={{ multiline: true }}
                />
              </div>
            </Col>
            <Col>
              <div className="area-C" style={{ marginTop: '20px', float: 'right' }}>
                <h4>Area C</h4>
                <SeatPicker
                  addSeatCallback={this.addSeatCallback}
                  removeSeatCallback={this.removeSeatCallback}
                  rows={rowsC}
                  maxReservableSeats={this.state.event.no_of_tables}
                  selectedByDefault
                  loading={false}
                  tooltipProps={{ multiline: true }}
                />
              </div>
            </Col>
          </Row>
        </div>

<hr/>
        <div className="m-3">
          <button className="btn btn-outline-primary float-right" onClick={this.checkout} disabled={!this.state.maxReservableTables}> Confirm </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return  {
      selected_event: state.Event.selected
    };
}

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SeatPlanner);