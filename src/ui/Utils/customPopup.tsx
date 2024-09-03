import React, { useId } from 'react';
import Popup from 'reactjs-popup';

function CustomPopup({ trigger, children, ...props }) {
  const popupId = useId();

  return (
    <Popup
      {...props}
      trigger={React.cloneElement(trigger, {
        'aria-describedby': popupId,
      })}
      contentProps={{
        id: popupId,
        role: 'dialog',
        'aria-modal': true,
        ...props.contentProps,
      }}
    >
      {children}
    </Popup>
  );
}

export default CustomPopup;