import React from 'react'
import Link from 'gatsby-link'

import logo from '../../assets/img/logo.png'

const Header = () => (
  <div className='header'>
    <div className='menu' >
      <div className="wrapper">
        <div className="one">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="btn two">blog</div>
        <div className="btn three">repos</div>
      </div>
    </div>
  </div>
)

export default Header
