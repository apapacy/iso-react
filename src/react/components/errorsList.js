import React from 'react';

export default(props) => (
  props.error && props.error.errors
  ? <ul className='error-messages'>
    {
      Object.keys(props.error.errors)
        .map(field => props.error.errors[field]
          .map(message => <li>{field} {message}</li>))
    }
  </ul>
  : null);
