import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_USER_RECIPES } from '../../queries';

const UserRecipes = ({ username }) => (
  <Query
    query={GET_USER_RECIPES}
    variables={{ username }}
  >
    {({ data, loading, error }) => {
      if (loading) return <div><span role="img" aria-label="Hourglass">⏳</span> Loading...</div>
      if (error) return <div>Error</div>
      return (
        <ul>
          <h3>Your recipes</h3>
          {data.getUserRecipes.map(recipe => (
            <li key={recipe._id}>
              <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
              <p>Likes: {recipe.likes}</p>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default UserRecipes;
