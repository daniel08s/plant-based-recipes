import styled, { css } from 'styled-components';

const Button = styled.button`
  border-radius: 3px;
  padding: 0 33px;
  margin: 0 1em;
  background: transparent;
  color: #33C3F0;
  border: 2px solid #33C3F0;

  ${props => 
    props.primary &&
    css`
      background: #33C3F0;
      color: white;
      :hover,
      :focus {
        color: #33C3F0;
        border: 2px solid #33C3F0;
        background: white;
        box-shadow: 0 0 0 1px #33C3F0;
        transition: all 500ms ease;
      }
    `
  }
`;

export default Button;
