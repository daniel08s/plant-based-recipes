import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';
import Spinner from '../Spinner';
import UserModal from '../Profile/UserModal';

class RecipePage extends React.Component {

  state = {
    modal: false,
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.location.state.modal === false) {
      this.setState({ modal: false })
    }
  }

  loadUser = () => {
    this.setState({ modal: true });
  }

  closeModal = () => {
    this.setState({ modal: false });
  }

  render() {
    const { _id } = this.props.match.params;
    const { modal } = this.state;

    return (
      <div className="App">
        <h1 className="main-title">Recipe Page</h1>
        <Query query={GET_RECIPE} variables={{ _id }}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div>{error.message}</div>
            return (
              <div className="App">
                {modal &&
                  <UserModal
                    username={data.getRecipe.username}
                    closeModal={this.closeModal}
                  />
                }
                <div
                  className="recipe-image"
                  style={{ background: `url(${data.getRecipe.imageUrl}) center center / cover no-repeat` }}  
                >
                </div>
                <div className="recipe">
                  <div className="recipe-header">
                    <h2 className="recipe-name">
                      <strong>{data.getRecipe.name}</strong>
                    </h2>
                    <h5>
                      <strong>{data.getRecipe.category}</strong>
                    </h5>
                    <p>
                      Created by <strong onClick={() => this.loadUser()}>
                      {data.getRecipe.username}
                      </strong>
                    </p>
                    <p>
                      {data.getRecipe.likes} <span role="img" aria-label="Heart">❤</span>
                    </p>
                  </div>
                  <blockquote className="recipe-description">
                    {data.getRecipe.description}
                  </blockquote>
                  <h3 className="recipe-instructions__title">Instructions</h3>
                  <div
                    className="recipe-instructions"
                    dangerouslySetInnerHTML={{ __html: data.getRecipe.instructions }}>
                    
                  </div>
                  <LikeRecipe _id={_id} />
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    )};
};

export default withRouter(RecipePage);
