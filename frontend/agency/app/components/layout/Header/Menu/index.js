import React, { useMemo } from 'react';
import MenuItem from './MenuItem';
import { removeToken } from 'services/authentication';
import {
  UsergroupDeleteOutlined,
  StarOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import EmployeeIcon from 'images/icons/employee.png';
import AccountIcon from 'images/icons/account.png';
import ClientIcon from 'images/icons/client.png';
import SettingIcon from 'images/icons/setting.png';
import SubscriptionIcon from 'images/icons/subscription.png';
import SignOutIcon from 'images/icons/sign-out.png';

import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';
import { tokenDecoded } from 'utils/authHelper';


const Menu = () => {
  const onSignOut = () => {
    removeToken();
  }
  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  let menuItems
  if (infoAuth?.role === 'agency') {
    menuItems = [
      { id: 1, icon: (<img src={EmployeeIcon} />), iconColor: "primary", title: <FormattedMessage {...messages.employeeList} />, link: "/recruiter-list" },
      { id: 2, icon: (<img src={ClientIcon} />), iconColor: "orange", title: <FormattedMessage {...messages.clientList} />, link: "/client-list" },
      { id: 3, icon: (<img src={SubscriptionIcon} />), iconColor: "primary", title: <FormattedMessage {...messages.subscription} />, link: "/subscription-info" },
      { id: 4, icon: (<img src={EmployeeIcon} />),  iconColor: "primary", title: <FormattedMessage {...messages.jobList} />, link: "/job-list" },
      { id: 5, icon: (<img src={AccountIcon} />),  iconColor: "primary", title: <FormattedMessage {...messages.myAccount} />, link: "/my-account" },
      { id: 6, icon: (<img src={SettingIcon} />), iconColor: "grey", title: <FormattedMessage {...messages.setting} />, link: "/settings" },
      { id: 7, icon: (<img src={SignOutIcon} />), iconColor: "red", title: <FormattedMessage {...messages.signOut} />, link: "/", click: onSignOut },
    ];
  } else if (infoAuth?.role === 'recruiter') {
    menuItems = [
      { id: 1, icon: (<img src={EmployeeIcon} />), iconColor: "primary", title: <FormattedMessage {...messages.myDashboard} />, link: "/" },
      { id: 4, icon: (<img src={AccountIcon} />),  iconColor: "primary", title: <FormattedMessage {...messages.myAccount} />, link: "/my-account" },
      { id: 5, icon: (<img src={SettingIcon} />), iconColor: "grey", title: <FormattedMessage {...messages.setting} />, link: "/settings" },
      { id: 6, icon: (<img src={SignOutIcon} />), iconColor: "red", title: <FormattedMessage {...messages.signOut} />, link: "/", click: onSignOut },
    ];
  }
  return (
    <div className="menu-container">
      {menuItems.map(item => {
        return <MenuItem key={item.id} icon={item.icon} iconColor={item.iconColor} title={item.title} link={item.link} click={item.click} />
      })}
    </div>
  )
}

export default Menu;
