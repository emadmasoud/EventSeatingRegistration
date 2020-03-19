import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import SeatPicker from 'react-seat-picker'
import { ToastsStore } from 'react-toasts';
import axios from 'axios';
import { BASE_URL } from '../Config'
import {connect} from 'react-redux';
class SeatPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      event: this.props.selected_event,
      tables_list: this.props.selected_event.tables_list,
      selectedTablesCount: 0,
      selectedTables: [],
      maxReservableTables: this.props.paidTablesCount ? this.props.paidTablesCount : 3,
      rowCountPerArea: {
        'A': [8],
        'B': [4],
        'C': [4],
        'D': [6, 7, 7],
        'E': [6, 7, 7]
      }
    }

   
  }
  
  componentDidMount() {

    // this.getAllTables();
    // let t_list = []


    // for (var i = 1; i <= 20; i++) {
    //   t_list.push({ id: i, number: `${i}-E`, tooltip: `Table ${i} from Area E`, isReserved: false, area: 'E' })
    // }
    // for (var i = 1; i <= 20; i++) {
    //   t_list.push({ id: i, number:`${i}-B`, tooltip: `Table ${i} from Area B`, isReserved: false, area: 'B' })
    // }
    // for (var i = 1; i <= 20; i++) {
    //   t_list.push({ id: i, number: `${i}-C`, tooltip: `Table ${i} from Area C`, isReserved: false, area: 'C' })
    // }
    // for (var i = 1; i <= 40; i++) {
    //   t_list.push({ id: i, number: `${i}-A`, tooltip: `Table ${i} from Area A`, isReserved: true, area: 'A' })
    // }


    //    for (var i = 1; i <= 20; i++) {
    //   t_list.push({  id: i,  event_id: 1, number: `${i}-D`, tooltip: `Table ${i} from Area D`, isReserved: false, area: 'D' })
    // }
    // this.setState({ tables_list: t_list })
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
      ToastsStore.error(`Sorry, You have paid for ${this.state.maxReservableTables} tables only`)
    }

  }



  removeSeatCallback = ({ row, number, id }, removeCb) => {

    let totalTables = this.state.selectedTablesCount - 1;
    if (totalTables < 0)
      totalTables = 0;
    // await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Removed seat ${number}, row ${row}, id ${id}`)

    removeCb(row, number)
    this.setState({ loading: false, selectedTablesCount: totalTables })

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

  render() {
    let rowsA = this.getAlignedTables("A", this.state.tables_list)

    let rowsB = this.getAlignedTables("B", this.state.tables_list)

    let rowsC = this.getAlignedTables("C", this.state.tables_list)

    let rowsD = this.getAlignedTables("D", this.state.tables_list)

    let rowsE = this.getAlignedTables("E", this.state.tables_list)

    console.log("render---------------------", this.state.event)
    const { loading } = this.state

    return (
      <div className="seat-picker-container">
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
              Stage & Dance Floor
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
            <hr />
            <hr />
          </Row>
          <Row>
            <Col>
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