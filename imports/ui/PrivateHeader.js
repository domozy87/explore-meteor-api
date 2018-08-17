import React from 'react'
import { Accounts } from 'meteor/accounts-base'

const PrivateHeader = props => (
  <div className="header">
    <div className="header__content">
      <h1 className="header__title">{props.title ? props.title : 'Driver App Back-end'}</h1>
      <button className="button button--link-text" onClick={() => Accounts.logout()}>Logout</button>
    </div>
  </div>
)

PrivateHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
}

export default PrivateHeader
