// npm packages
import React from 'react';
import { Query } from 'react-apollo';
import posed from 'react-pose';
import Spinner from './Spinner';

// our packages
import { GET_ALL_RECIPES } from '../queries';
import RecipeItem from './Recipe/RecipeItem';

// styling
import './App.css';

const RecipeList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100
  },
  hidden: {
    x: '-100%'
  }
});

class App extends React.Component {
  state = {
    on: false
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({ on: !this.state.on });
  }

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find recipes you <strong>love <span role="img" aria-label="Heart">❤</span></strong>
        </h1>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div><span role="img" aria-label="StopSign">🛑</span> Error</div>
            
            const { on } = this.state;

            return (
              <RecipeList
                className="cards"
                pose={ on ? 'shown' : 'hidden' }
              >
                {data.getAllRecipes.map(recipe => (
                  <RecipeItem key={recipe._id} {...recipe} />
                ))}
              </RecipeList>
            )
          }}
        </Query>
      </div>
    );
  }
};

export default App;
