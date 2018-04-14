import React from 'react'
import Link from 'gatsby-link'

import logo from '../../assets/img/logo.png'

const Header = () => (
  <div className='header'>
    <div className='menu' >
      <div className="wrapper">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="btn two">
          <Link to="/">blog</Link>
        </div>
        <div className="btn three">
        <Link to="/page-2/">repos</Link>
        </div>
      </div>
    </div>
  </div>
)

export default Header
