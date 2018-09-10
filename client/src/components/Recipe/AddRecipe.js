import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import CKEditor from 'react-ckeditor-component';

import {
  ADD_RECIPE,
  GET_ALL_RECIPES, GET_USER_RECIPES
} from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';
import Spinner from '../Spinner';

const initialState = {
  name: "",
  imageUrl: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};

class AddRecipe extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    this.setState({ username: this.props.session.getCurrentUser.username });
  }

  clearState = () => {
    this.setState({ ...initialState, username: this.state.username });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };
  
  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe()
      .then(async () => {
        await this.props.refetch();
        this.clearState();
        this.props.history.push('/');
      });
  };

  validateForm = () => {
    const { name, imageUrl, description, category, instructions } = this.state;
    const isInvalid = !name || !imageUrl || !description || !category || !instructions;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  render() {
    const { name, imageUrl, description, category, instructions, username } = this.state;
    return (
    <div className="App">
      <h1 className="main-title">Add Recipe</h1>
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, imageUrl, description, category, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}  
      >
        {(addRecipe, { data, loading, error }) => {
          if (loading) return <Spinner />
          return (
            <form
              className="form"
              onSubmit={event => this.handleSubmit(event, addRecipe)} >
              <label htmlFor="name">Recipe name</label>
              <input
                type="text"
                name="name"
                placeholder="Add Name"
                onChange={this.handleChange}
                value={name}
              />
              <label htmlFor="imageUrl">Recipe image</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="Add Image URL"
                onChange={this.handleChange}
                value={imageUrl}
              />
              <label htmlFor="category">Recipe category</label>
              <select
                name="category"
                onChange={this.handleChange}
                value={category}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Drinks">Drinks</option>
              </select>
              <label htmlFor="description">Recipe description</label>
              <input
                type="text"
                name="description"
                placeholder="Add description"
                onChange={this.handleChange}
                value={description}
              />
              <label htmlFor="instructions">Recipe instructions</label>
              <CKEditor 
                name="instructions"
                content={instructions}
                events={{ change: this.handleEditorChange }}
              />
              <button
                type="submit"
                className="button-primary"
                disabled={loading || this.validateForm()}
              >Submit</button>
              {error &&  <Error error={error} />}
            </form>
          );
        }}
      </Mutation>
    </div>
    );
  };
};

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));
