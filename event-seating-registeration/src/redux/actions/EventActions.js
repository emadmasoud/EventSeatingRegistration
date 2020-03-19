import { SET_SELECTED_EVENT } from "../types";

export function selectEvent(event) { 
    return (dispatch,getState)=> {
        var st = getState();
        console.log("selectEvent Action called ", event) 

        return dispatch({
            type: SET_SELECTED_EVENT,
            payload: event,
          });   
        
        
    }
   
  

}