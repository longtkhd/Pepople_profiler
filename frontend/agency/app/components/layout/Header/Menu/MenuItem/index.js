import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.less';

const MenuItem = (props) => {
  const { icon, title, iconColor, link, click } = props;
  const colorClass = `color-${iconColor || 'primary'}`;

  return (
    <Link to={link} onClick={click}>
      <div className="menu-item">
        <div className={`icon ${colorClass}`}>{icon}</div>
        <div className="menu-title">{title}</div>
      </div>
    </Link>
  )
}

MenuItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.any.isRequired,
  iconColor: PropTypes.string,
  link: PropTypes.string.isRequired,
  click: PropTypes.func,
};

export default MenuItem;
