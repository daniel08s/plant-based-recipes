import React from 'react';
import { Link } from 'react-router-dom';
import posed from 'react-pose';

const SearchItem = posed.li({

});

export default ({ _id, name, likes, imageUrl }) => (
    <SearchItem 
      style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
      className="card"
    >
      <div className="card-text">
        <Link to={`/recipes/${_id}`}>
          <h4>{name}</h4>
        </Link>
        <span>{likes} <span role="img" aria-label="Heart">❤</span></span>
      </div>
    </SearchItem>
);
