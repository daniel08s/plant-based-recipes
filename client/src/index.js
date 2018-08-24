import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import './index.css';

import App from './components/App';
import Navbar from './components/Navbar';
import withSession from './components/withSession';
import Search from './components/Recipe/Search';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import AddRecipe from './components/Recipe/AddRecipe';
import RecipePage from './components/Recipe/RecipePage';
import Profile from './components/Profile/Profile';

const client = new ApolloClient({
  uri: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError){
      console.log('Network Error', networkError);

      // if (networkError.statusCode === 401) {
      //   localStorage.removeItem('token');
      // }
    }
  }
});

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" component={Search} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe refetch={refetch} />}
          session={session}
        />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route path="/profile" component={Profile} />
        <Route
          path="/signin"
          render={() => <Signin refetch={refetch} />}
        />
        <Route
          path="/signup"
          render={() => <Signup refetch={refetch} />}
        />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);
