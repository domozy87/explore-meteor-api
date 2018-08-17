import React from 'react'
import { Meteor } from 'meteor/meteor'

export default class OrderDetail extends React.Component {
  submitSearch() {
    const searchString = this.refs.searchText.value.trim()
    const resultBox = $('#resultBox')
    Meteor.call('order.detail', searchString, (err, res) => {
      if (!err) {
        resultBox.val(JSON.stringify(res))
      } else {
        resultBox.val(err.message)
      }
    })
  }

  render() {
    return (
      <div>
        <input type="text" ref="searchText" name="searchText" placeholder="Order ID" />
        <button className="button" onClick={this.submitSearch.bind(this)}>Search</button>
        <div>
          <textarea id="resultBox" rows="20" wrap="hard" cols="85" />
        </div>
      </div>
    )
  }
}
