import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { ADD_RECIPE } from '../../queries';
import Error from '../Error';

const initialState = {
  name: "",
  category: "Breakfast",
  description: "",
  instructions: ""
};

class AddRecipe extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    console.log(event.target);
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  
  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe()
      .then(() => {
        this.clearState();
        this.props.history.push('/');
      });
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
              <input type="text" name="name" placeholder="Recipe Name" onChange={this.handleChange} />
              <select
                name="category"
                onChange={this.handleChange}
                value={this.state.category}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Drinks">Drinks</option>
              </select>
              <input type="text" name="description" placeholder="Add description" onChange={this.handleChange} />
              <textarea name="instructions" placeholder="Add instructions" onChange={this.handleChange}></textarea>
              <button type="submit" className="button-primary">Submit</button>
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
