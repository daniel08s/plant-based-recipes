import styled, { css } from 'styled-components';

import Header from './Header';
import Details from './Details';
import Favorites from './Favorites';

const UserCard = styled.div`
  background-color: white;
  max-width: 35em;
  padding: 1em 1.5em;
  position: relative;
  margin: 2em;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
`;

UserCard.Header = Header;
UserCard.Details = Details;
UserCard.Favorites = Favorites;

export default UserCard;
