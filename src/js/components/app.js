import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectCountry } from '../redux/actions'

class App extends Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		const { dispatch } = this.props
		dispatch(selectCountry(e.target.value))
	}
  render() {
    return (
      <div>
		  {this.props.selectedCountry}

		  <select defaultValue={this.props.selectedCountry} onChange={this.handleChange}>
			  <option value="china">china</option>
			  <option value="japan">japan</option>
			  <option value="usa">usa</option>
		  </select>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const { selectedCountry } = state
  return {
	  selectedCountry
  }
}

export default connect(mapStateToProps)(App)
