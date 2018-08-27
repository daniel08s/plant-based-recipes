import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString('pt-PT');
  const newTime = new Date(date).toLocaleTimeString('pt-PT');
  return `${newDate} at ${newTime}`;
};

const UserInfo = ({ session }) => (
  <div>
    <h3>User info</h3>
    <p>Username: {session.getCurrentUser.username}</p>
    <p>Email: {session.getCurrentUser.email}</p>
    <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
    <ul>
      <h3>{session.getCurrentUser.username}'s favorites</h3>
      {session.getCurrentUser.favorites.map(favorite => 
        <li key={favorite._id}>
          <Link to={`/recipes/${favorite._id}`}><p>{favorite.name}</p></Link>
        </li>
      )}
      {!session.getCurrentUser.favorites.length && (
        <p>
          <strong>You have no favorites. Go add some! 
            <span role="img" aria-label="SmileyFaceSmileyEyes"></span>😊
          </strong>
        </p>
      )}
    </ul>
  </div>
);

export default UserInfo;
