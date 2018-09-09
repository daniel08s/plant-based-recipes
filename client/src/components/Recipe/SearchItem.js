import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ _id, name, likes, imageUrl }) => (
  <li 
    style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
    className="card"
  >
    <div className="card-text">
      <Link to={`/recipes/${_id}`}>
        <h4>{name}</h4>
      </Link>
      <span>{likes} <span role="img" aria-label="Heart">❤</span></span>
    </div>
  </li>
);

export default SearchItem;
