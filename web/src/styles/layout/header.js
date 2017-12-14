import styled from 'styled-components';
import typography from '../base/typography';

export const UntitledHeader = styled.header`
  grid-column-start: 3;
  @media (max-width:1024px) {
    margin-left: 4rem;
    grid-column-start: 2;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    grid-column-start: 1;
    margin-left: 0;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    grid-column-start: 1;
    margin-left: 0;
  }
`
export const MainTitle = styled.h1`
  font-size: 7em;
  color: #fff;
  font-weight:300;
  text-transform: uppercase;
  margin-left: 1.6em;
  @media (max-width: 1440px) {
    font-size: 5.5em;
    margin-top: 1.45rem;
    margin-left: 1.52em;
  }
  @media (max-width: 1024px) {
    font-size: 3.7em;
    margin-top: 1.6rem;
    margin-left: 1.6em;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 4.5em;
    margin-top: -4.5rem;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    display: none;
  }
`
export const SecondTitle = styled.h2`
  font-size: 3em;
  color: #fff;
  font-weight: 300;
  text-transform: uppercase;
  grid-column-start: 3;
  margin-top: 4rem;
`

export const Logo = styled.div`
  grid-column-start: 2;
  background-repeat: no-repeat;
  width:20vw;
  height:20vh;
  position: relative;
  @media (max-width: 768px) and (orientation: portrait) {
    grid-column-start: 1;
    width: 30vw;
    height: 30vh;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    width: 30vw;
    height: 30vh;
  }
`
