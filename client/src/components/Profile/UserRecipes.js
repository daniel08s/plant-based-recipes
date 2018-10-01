import React from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
  UPDATE_USER_RECIPE
} from '../../queries';
import Spinner from '../Spinner';

class UserRecipes extends React.Component {

  state = {
    _id: '',
    name: '',
    imageUrl: '',
    description: '',
    category: '',
    modal: false,
  };

  handleSubmit = (event, updateUserRecipe) => {
    event.preventDefault();
    updateUserRecipe().then(() => {
      this.closeModal();
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  
  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm('Are you sure you want to delete the recipe?');
    if (confirmDelete) {
      deleteUserRecipe();
    }
  };

  loadRecipe = recipe => {
    this.setState({ ...recipe, modal: true });
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;

    return (
      <Query
        query={GET_USER_RECIPES}
        variables={{ username }}
      >
        {({ data, loading, error }) => {
          if (loading) return <Spinner />
          if (error) return <div>Error</div>
          return (
            <ul>
              {modal &&
                <EditRecipeModal
                  handleSubmit={this.handleSubmit}
                  recipe={this.state}
                  handleChange={this.handleChange}
                  closeModal={this.closeModal}
                />
              }
              <h3>Your recipes</h3>
              {!data.getUserRecipes.length && (
                <p>
                  <strong>You haven't added any recipes yet. Go ahead and add one! 
                    <span role="img" aria-label="GreenSalad">🥗</span>
                  </strong>
                </p>
              )}
              {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                  <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                  <p style={{ marginBottom: "0" }}>Likes: {recipe.likes}</p>

                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ _id: recipe._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username }
                      });

                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: {
                          getUserRecipes: getUserRecipes.filter(
                            recipe => recipe._id !== deleteUserRecipe._id
                          )
                        }
                      });
                    }}
                  >
                  {(deleteUserRecipe, attrs = {}) => (
                      <div>
                        <button
                          className="button-primary"
                          onClick={() => this.loadRecipe(recipe)}  
                        >Update</button>
                        <button
                          className="delete-button"
                          onClick={() => this.handleDelete(deleteUserRecipe)}
                        >
                          {attrs.loading ? 'deleting...' : 'DELETE'}
                        </button>
                      </div>
                    )
                  }
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }
}

const EditRecipeModal = ({ handleSubmit, recipe, handleChange, closeModal }) => (
  <Mutation
    mutation={UPDATE_USER_RECIPE}
    variables={{
      _id: recipe._id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      category: recipe.category,
      description: recipe.description
    }}
  >
  {updateUserRecipe => (
    <div className="modal modal-open">
      <div className="modal-inner">
        <div className="modal-content">
          <form
            className="modal-content-inner"
            onSubmit={event => handleSubmit(event, updateUserRecipe)}
          >
            <h4>Edit Recipe</h4>
            <label htmlFor="name">Recipe name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={recipe.name}
            />
            <label htmlFor="imageUrl">Recipe image</label>
            <input
              type="text"
              name="imageUrl"
              onChange={handleChange}
              value={recipe.imageUrl}
            />
            <label htmlFor="category">Recipe category</label>
            <select
              name="category"
              onChange={handleChange}
              value={recipe.category}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Drinks">Drinks</option>
            </select>
            <label htmlFor="description">Recipe description</label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={recipe.description}
            />

            <hr />
            <div className="modal-buttons">
              <button type="submit" className="button-primary">
                Update
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}
  </Mutation>
);

export default UserRecipes;
