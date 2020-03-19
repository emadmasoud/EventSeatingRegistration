import {
    SET_SELECTED_EVENT
  } from "../types";


  const initialState = { selected: null };
  
export default function(
    state = initialState,
    action = {}
  ) {
    let clone = JSON.parse(JSON.stringify(state));
    
    console.log("Clone ", clone)
    console.log("type ", action.type)
    switch (action.type) {
      case SET_SELECTED_EVENT:
        clone.selected = action.payload;
        return clone;
  
    }
    return clone;
  }
  