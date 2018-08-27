import React from 'react';
import { Mutation } from 'react-apollo';

import withSession from '../withSession';
import { GET_RECIPE, LIKE_RECIPE } from '../../queries';

class LikeRecipe extends React.Component {
  state = {
    liked: false,
    username: ''
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      const { _id } = this.props;
      const prevLiked = favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({
        username,
        liked: prevLiked
      });
    }
  }

  handleClick = likeRecipe => {
    this.setState(prevState => ({
      liked: !prevState.liked
    }),
    () => this.handleLike(likeRecipe)
    );
  }

  handleLike = likeRecipe => {
    if (this.state.liked) {
      likeRecipe().then(async ({ data }) => {
        console.log(data);
        await this.props.refetch();
      });
    } else {
      // "unlike" recipe mutation
      console.log('Unliking');
    }
  }

  updateCache = (cache, { data: { likeRecipe } }) => {
    const { getRecipe } = cache.readQuery(
      { query: GET_RECIPE },
      { variables: this.props._id }
    );
    
    cache.writeQuery({
      query: GET_RECIPE,
      data: {
        likeRecipe: [...getRecipe]
      }
    });
  };

  render() {
    const { username, liked } = this.state;
    const { _id } = this.props;

    return (
      <Mutation
        mutation={LIKE_RECIPE}
        variables={{ _id, username }}
        // refetchQueries={() => [
        //   { query: GET_RECIPE, variables: { _id } }
        // ]}
        // update={this.updateCache}  
      >
      {likeRecipe => (
        username && (
          <button onClick={() => this.handleClick(likeRecipe)}>
            {!liked ? 'Like' : 'Unlike'}
          </button>
        )
      )}
      </Mutation>
    );
  }
}

export default withSession(LikeRecipe);
