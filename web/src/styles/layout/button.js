import styled from 'styled-components';
import { Link } from 'react-router-dom';
import typography from '../base/typography';

export const UntitledNav = styled.nav`
  grid-column-start: 3;
  @media (max-width: 1024px) {
    grid-column-start: 2;
    margin-top: 3rem;
    padding: 1rem 3rem;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    grid-column-start: 1;
    grid-row-start: 2;
    margin-top: 0;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    padding: 0 1rem;
  }
`

export const Button = styled(Link)`
  grid-column-start: 3;
  color: #fff;
  font-size: 1em;
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
  @media (max-width: 1024px) {
    font-size: 0.8em;
    padding: 1rem 2rem;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 1em;
    &:last-child{
      margin-left: ${props => props.home ? 0 : 2.2 + "rem"};
    }
    @media (max-width: 375px) and (orientation: portrait) {
      font-size: 0.8em;
      &:last-child{
        margin-left: ${props => props.home ? 0 : 1.5 + "rem"};
      }
    }

  }
`
