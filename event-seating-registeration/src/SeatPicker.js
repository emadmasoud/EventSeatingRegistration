import React, {Component} from 'react'
 
import SeatPicker from 'react-seat-picker'
 
export default class SeatPlanner extends Component {
  state = {
    loading: false
  }
 
  addSeatCallback = ({ row, number, id }, addCb) => {
    this.setState({
      loading: true
    }, async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500))
      console.log(`Added seat ${number}, row ${row}, id ${id}`)
      const newTooltip = `tooltip for id-${id} added by callback`
      addCb(row, number, id, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  addSeatCallbackContinousCase = ({ row, number, id }, addCb, params, removeCb) => {
    this.setState({
      loading: true
    }, async () => {
      if (removeCb) {
        // await new Promise(resolve => setTimeout(resolve, 750))
        console.log(`Removed seat ${params.number}, row ${params.row}, id ${params.id}`)
        removeCb(params.row, params.number)
      }
      await new Promise(resolve => setTimeout(resolve, 750))
      // console.log(`Added seat ${number}, row ${row}, id ${id}`)
      const newTooltip = `tooltip for id-${id} added by callback`
      addCb(row, number, id, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  removeSeatCallback = ({ row, number, id }, removeCb) => {
    this.setState({
      loading: true
    }, async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500))
      console.log(`Removed seat ${number}, row ${row}, id ${id}`)
      // A value of null will reset the tooltip to the original while '' will hide the tooltip
      const newTooltip = ['A', 'B', 'C'].includes(row) ? null : ''
      removeCb(row, number, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  render() {
    const rows = [
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'}, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}, null, {id: 5, number: 5}, {id: 6, number: 6}],
     ,  
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},{id: 91, number: 91, isSelected: true, tooltip: 'Reserved by you'}, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}, null, {id: 5, number: 5}, {id: 6, number: 6}],
       ,
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},{id: 91, number: 91, isSelected: true, tooltip: 'Reserved by you'}, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}, null, {id: 5, number: 5}, {id: 6, number: 6}],
       
    
    ]
    const rows2 = [
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},null, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}],
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},null, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}],
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},null, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}],
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},null, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}],
      [{id: 1, number: 1, isSelected: true, tooltip: 'Reserved by you'},null, {id: 2, number: 2, tooltip: 'Cost: 15$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved by Rogger'}, {id: 4, number: '4', orientation: 'west'}],
   
    
    ]
    const {loading} = this.state
    return (
      <div>
        <h1>Seat Picker</h1>
        <div style={{marginTop: '100px'}}>
          <SeatPicker
            
            addSeatCallback={this.addSeatCallback}
            removeSeatCallback={this.removeSeatCallback}
            rows={rows}
            maxReservableSeats={3}         
            selectedByDefault
            loading={false}
            tooltipProps={{multiline: true}}
          />
        </div>
        <div style={{marginTop: '100px'}}>
          <SeatPicker
            
            addSeatCallback={this.addSeatCallback}
            removeSeatCallback={this.removeSeatCallback}
            rows={rows2}
            maxReservableSeats={3}         
            selectedByDefault
            loading={false}
            tooltipProps={{multiline: true}}
          />
          <span style={{marginLeft: '100px', float:"right"}}>
          <SeatPicker
            addSeatCallback={this.addSeatCallback}
            removeSeatCallback={this.removeSeatCallback}
            rows={rows2}
            maxReservableSeats={3}         
            selectedByDefault
            loading={false}
            tooltipProps={{multiline: true}}
          />
          </span>
        
        </div>
      
      </div>
    )
  }
}