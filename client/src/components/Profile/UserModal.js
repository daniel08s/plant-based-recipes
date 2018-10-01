import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import Card from '../../blocks/UserCard';
import { GET_USER } from '../../queries';
import Spinner from '../Spinner';

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString('pt-PT');
  return `${newDate}`;
};

const UserModal = ({ username, closeModal }) => {
  return (
    <Query
      query={GET_USER}
      variables={{ username }}
    >
    {(data, loading, error) => {
      if (loading) return <Spinner />
      if (error) return <div>Error</div>
      const user = data.data.getUser;
      console.log(user);
      return (
        <div className="modal modal-open">
          <div className="modal-inner">
            <Card>
              <Card.Header>
                {console.log(data.data)}
                {data.data.getUser.username}
              </Card.Header>{/*
              <Card.Details>
                <p>Join Date: {formatDate(data.getUser.joinDate)}</p>
              </Card.Details>
              <Card.Favorites>
                <ul>
                  <h3>{data.getUser.username}'s favorites</h3>
                  {data.getUser.favorites.map(favorite => 
                    <li key={favorite._id}>
                      <Link to={`/recipes/${favorite._id}`}><p>{favorite.name}</p></Link>
                    </li>
                  )}
                  {!data.getUser.favorites.length && (
                    <p>
                      <strong>{data.getUser.username} has no favorites!</strong>
                    </p>
                  )}
                </ul>
              </Card.Favorites> */}
              <button onClick={closeModal}>Close</button>
            </Card>
          </div>
        </div>
      );
    }}
    </Query>
  );
};

export default UserModal;
