import { combineReducers } from 'redux';
import EventReducer from './EventReducer'

export default  combineReducers({
  Event: EventReducer,
});
