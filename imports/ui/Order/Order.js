import React from 'react'
import PrivateHeader from '../PrivateHeader'
import SearchSite from './OrderDetail'

export default () => (
  <div>
    <PrivateHeader title="Order Detail" />
    <div className="page-content">
      <SearchSite />
    </div>
  </div>
)
