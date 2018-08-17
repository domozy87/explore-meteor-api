import React from 'react'
import { Meteor } from 'meteor/meteor'

export default class SearchComment extends React.Component {
  submitSearch() {
    const orderId = this.refs.searchText.value.trim()
    const resultBox = $('#resultBox')
    Meteor.call('comments.list', orderId, 5, (err, res) => {
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
