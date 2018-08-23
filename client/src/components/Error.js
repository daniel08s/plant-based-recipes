import React from 'react';

const Error = ({ error }) => <p><span role="img" aria-label="Red Cross Mark">❌</span> {error.message}</p>;

export default Error;
