import { combineReducers } from 'redux'
import { SELECT_COUNTRY } from '../actions'

function selectedCountry(state = 'japan', action) {
  switch (action.type) {
    case SELECT_COUNTRY:
      return action.country
    default:
      return state
  }
}


const rootReducer = combineReducers({
	selectedCountry
})

export default rootReducer
