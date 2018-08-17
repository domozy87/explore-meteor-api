import React from 'react'
import PrivateHeader from '../PrivateHeader'
import SearchSite from './SearchSite'

export default () => (
  <div>
    <PrivateHeader title="Sites" />
    <div className="page-content">
      <SearchSite />
    </div>
  </div>
)
