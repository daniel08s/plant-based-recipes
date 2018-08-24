import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { ADD_RECIPE } from '../../queries';
import Error from '../Error';

const initialState = {
  name: "",
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
    const { name, description, category, instructions } = this.state;
    const isInvalid = !name || !description || !category || !instructions;
    return isInvalid;
  };

  render() {
    const { name, description, category, instructions, username } = this.state;
    return (
    <div className="App">
      <h2>Add Recipe</h2>
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, description, category, instructions, username }}>
        {(addRecipe, { data, loading, error }) => {
          if (loading) return <div><span role="img" aria-label="Hourglass">⏳</span> Loading...</div>
          return (
            <form
              className="form"
              onSubmit={event => this.handleSubmit(event, addRecipe)} >
              <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                onChange={this.handleChange}
                value={name}
              />
              <select
                name="category"
                onChange={this.handleChange}
                value={category}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Drinks">Drinks</option>
              </select>
              <input
                type="text"
                name="description"
                placeholder="Add description"
                onChange={this.handleChange}
                value={description}
              />
              <textarea
                name="instructions"
                placeholder="Add instructions"
                onChange={this.handleChange}
                value={instructions}
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

export default withRouter(AddRecipe);
