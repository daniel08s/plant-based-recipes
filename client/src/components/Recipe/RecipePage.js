import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_RECIPE } from '../../queries';

const RecipePage = ({ match }) => {
  const { _id } = match.params;
  return (
  <Query query={GET_RECIPE} variables={{ _id }}>
    {({ data, loading, error }) => {
      if (loading) return <div><span role="img" aria-label="Hourglass">⏳</span> Loading...</div>
      if (error) return <div>Error</div>
      return (
        <Fragment>
          <div className="App">Recipe Page</div>
          <h2>{data.getRecipe.name}</h2>
          <p>Category: {data.getRecipe.category}</p>
          <p>Description: {data.getRecipe.description}</p>
          <p>Instructions: {data.getRecipe.instructions}</p>
          <p>Likes: {data.getRecipe.likes}</p>
          <p>Created By: {data.getRecipe.username}</p>
          <button>Like</button>
        </Fragment>
      );
    }}
  </Query>
  );
};

export default withRouter(RecipePage);
