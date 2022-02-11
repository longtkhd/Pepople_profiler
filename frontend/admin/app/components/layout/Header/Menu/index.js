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
  ProjectOutlined

} from '@ant-design/icons';
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

  menuItems = [
    { id: 1, icon: (<UsergroupDeleteOutlined />), iconColor: "primary", title: <FormattedMessage {...messages.agencyList} />, link: "/admin-agency-list" },
    // { id: 2, icon: (<StarOutlined />), iconColor: "orange", title: <FormattedMessage {...messages.recruiterList} />, link: "/recruiter-list" },
    { id: 2, icon: (<HeartOutlined />), iconColor: "red", title: <FormattedMessage {...messages.assessmentIn} />, link: "/admin-assessment" },
    { id: 3, icon: (<BuildOutlined />), iconColor: "primary", title: <FormattedMessage {...messages.assessmentType} />, link: "/admin-assessment-type" },
    { id: 4, icon: (<ProjectOutlined />), iconColor: "grey", title: <FormattedMessage {...messages.projectAssessment} />, link: "/project-assessment" },
    { id: 5, icon: (<UserOutlined />), iconColor: "primary", title: <FormattedMessage {...messages.myAccount} />, link: "/my-account" },
    { id: 6, icon: (<LogoutOutlined />), iconColor: "red", title: <FormattedMessage {...messages.signOut} />, link: "/", click: onSignOut },
  ];


  return (
    <div className="menu-container">
      {menuItems.map(item => {
        return <MenuItem key={item.id} icon={item.icon} iconColor={item.iconColor} title={item.title} link={item.link} click={item.click} />
      })}
    </div>
  )
}

export default Menu;
