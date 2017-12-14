import styled from 'styled-components';
import { Link } from 'react-router-dom';
import typography from '../base/typography';
import {
  lightTeal,
  halfTeal,
  darkTeal
} from '../base/variables';

export const UntitledNav = styled.nav`
  grid-column-start: 3;
  @media (max-width: 1024px) {
    grid-column-start: 2;
    margin-top: 3rem;
    padding: 1rem 3rem;
    margin-left: 1rem;
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
  background-color: ${lightTeal};
  margin-top: ${props => props.home ? 2 + "rem" : 0};
  padding: 1rem 3rem;
  border-radius: 0.4rem;
  border-bottom: 4px solid ${halfTeal};
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.5);
  transition: all .3s ease-in-out;
  &:last-child{
    margin-left: ${props => props.home ? 0 : 1 + "rem"};
  }
  &:hover{
    text-decoration: none;
    color: #fff;
    background-color: ${halfTeal};
    border-bottom: 4px solid ${darkTeal};
    box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.4);
  }
  @media (max-width: 1024px) {
    font-size: 0.8em;
    padding: 1rem 2rem;
    grid-column-start: ${props => props.home ? 2 : 3};
    &:last-child {
      margin-left: ${props => props.home ? 4 + "rem" : 2 + "rem"};
    }
  }
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 1em;
    grid-column-start: ${props => props.home ? 1 : 1};
    &:last-child{
      margin-left: ${props => props.home ? 0 : 2.2 + "rem"};
    }
  }
  @media (max-width: 425px) and (orientation: portrait) {
    grid-row-start: ${props => props.home ? 2 : 3};
  }
  @media (max-width: 375px) and (orientation: portrait) {
    font-size: 0.8em;
    &:last-child{
      margin-left: ${props => props.home ? 0 : 1.5 + "rem"};
    }
  }
`
