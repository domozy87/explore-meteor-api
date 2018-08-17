import React from 'react'
import { Meteor } from 'meteor/meteor'

export default class SearchTour extends React.Component {
  submitSearch() {
    const driverId = this.refs.searchText.value.trim()
    const resultBox = $('#resultBox')
    Meteor.call('tours.list', driverId, (err, res) => {
      if (!err) {
        resultBox.val(JSON.stringify(res))
      } else {
        resultBox.val(err.message)
      }
    })
  }

  generateSampleTour = () => {
    const email = this.refs.testDriverEmail.value.trim()
    const oldDriverId = this.refs.oldDriverId.value.trim()
    const resultBox = $('#genderResult')

    Meteor.call('tours.generateSampleDriverData', email, oldDriverId, (err) => {
      if (!err) {
        resultBox.text('Success generated!')
      } else {
        resultBox.text('Cannot Generate')
      }
    })
  }

  render() {
    return (
      <div>
        <input type="text" ref="searchText" name="searchText" placeholder="Driver ID" />
        <button className="button" onClick={this.submitSearch.bind(this)}>Search</button>
        <div>
          <textarea id="resultBox" rows="20" wrap="hard" cols="85" />
        </div>
        <br />
        <p>Generate Test User Driver</p>
        <input type="text" ref="testDriverEmail" name="testDriverEmail" placeholder="Test driver Email" />
        <input type="text" ref="oldDriverId" name="oldDriverId" placeholder="Old driver Id" />
        <button className="button" onClick={this.generateSampleTour.bind(this)}>Generate Sample Tour</button>
        <p id="genderResult" />
        <p>
          <b>Note</b>: This buttom is use for testing record only.
                It will create user(role driver) with your email and password: 123456789.
        </p>
      </div>
    )
  }
}
