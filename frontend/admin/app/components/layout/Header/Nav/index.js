import React from 'react';
import { Popover } from 'antd';
import { MenuOutlined, SearchOutlined, BellOutlined} from '@ant-design/icons';
import Menu from '../Menu';
import './styles.less';

const Nav = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <SearchOutlined />
        </li>
        <li className="navbar-item">
          <BellOutlined />
        </li>
        <li className="navbar-item menu">
          <Popover placement="bottomRight" content={<Menu />} trigger="click">
            <MenuOutlined />
          </Popover>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
