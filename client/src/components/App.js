// npm packages
import React from 'react';
import { Query } from 'react-apollo';

// our packages
import { GET_ALL_RECIPES } from '../queries';
import RecipeItem from './Recipe/RecipeItem';

// styling
import './App.css';

const App = () => (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div><span role="img" aria-label="Hourglass">⏳</span> Loading...</div>
        if (error) return <div>Error</div>
        console.log(data.getAllRecipes);
        return (
          <ul>
            {data.getAllRecipes.map(recipe => (
              <RecipeItem key={recipe._id} {...recipe} />
            ))}
          </ul>
        )
      }}
    </Query>
  </div>
);

export default App;
