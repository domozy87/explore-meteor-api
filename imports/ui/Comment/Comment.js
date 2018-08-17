import React from 'react'
import PrivateHeader from '../PrivateHeader'
import SearchSite from './SearchComment'

export default () => (
  <div>
    <PrivateHeader title="Comment" />
    <div className="page-content">
      <SearchSite />
    </div>
  </div>
)
