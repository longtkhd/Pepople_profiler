import React from 'react'
import DowngradeNotiIcon from 'images/icons/combined-shape.png';
import SuccessIcon from 'images/icons/iconfinder.png';

export const ContentModal = ({ title, message, isSuccess }) => {
  return (
    <div className='invite-confirm-content'>
      <img src={isSuccess ? SuccessIcon : DowngradeNotiIcon} alt='downgrade-notification' />
      <p className='title'>{title}</p>
      <p className='description'>{message}</p>
    </div>
  )
}
