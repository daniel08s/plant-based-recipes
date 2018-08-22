// npm packages
import React from 'react';
import { Query } from 'react-apollo';

// our packages
import { GET_ALL_RECIPES } from '../queries';

// styling
import './App.css';

const App = () => (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div>⏳ Loading...</div>
        if (error) return <div>Error</div>
        console.log(data);
        return (
          <p>Recipes</p>
        )
      }}
    </Query>
  </div>
);

export default App;
