import styled from 'styled-components';
import { Link } from 'react-router-dom';
import typography from '../base/typography';

export const UntitledNav = styled.nav`
  grid-column-start: 3;
`

export const Button = styled(Link)`
  grid-column-start: 3;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  background-color: rgba(102, 206, 217, 1);
  margin-left: ${props => props.home ? 0 : 1 + "rem"};
  padding: 1rem 3rem;
  border-radius: 0.4rem;
  border-bottom: 4px solid rgba(31, 101, 108, 1);
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.5);
  transition: all .3s ease-in-out;
  &:hover{
    text-decoration: none;
    color: #fff;
    background-color: rgba(34, 112, 120, 1);
    border-bottom: 4px solid rgba(24, 82, 88, 1);
    box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.4);
  }
`
