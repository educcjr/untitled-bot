import styled from 'styled-components';
import homeBg from 'images/un_bg.png'

export const Background = styled.section`
  background: url(${homeBg});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height:100vh;
  display: grid;
  grid-template-columns: 35vw 10vw 50vw;
  grid-template-rows: 20vh 30vh 20vh;
  grid-row-gap: 1em;
  grid-column-gap: 1em;
  justify-items: start;
  align-items: center;
  @media (max-width: 1024px) {
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 20vh 30vh 10vh;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    grid-template-columns: 100vw;
    grid-template-rows: 5vh 45vh 10vh;
    grid-column-gap: 0;
    justify-items: center;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    grid-template-columns: 100vw;
    grid-template-rows: 0 70vh 5vh;
    grid-column-gap: 0;
    grid-row-gap: 0;
    background-position: 17% 50%;
  }
  @media (max-width: 375px) and (orientation: portrait) {
    grid-template-rows: 0 60vh 5vh

  }
`
export const UntitledIntro = styled.article`
  width: 30vw;
  grid-column-start: 3;
  margin-top: 15rem;
  @media (max-width: 1440px) {
    margin-top: 10rem;
    width: 33vw;
  }
  @media (max-width:1024px) {
    grid-column-start: 2;
    margin-left: 4.1rem;
    width: 36vw;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    grid-column-start: 1;
    width: 80vw;
    margin-top: 0;
    grid-row-start: 3;
  }
  @media (max-width: 375px) and (orientation: portrait) {
    padding: 0 1.3rem;
    text-align: center;
    white-space:pre-wrap;
    margin-left: 0;
    width: 85vw;
  }
`
export const UntitledParagraph = styled.p`
  color: #fff;
  font-size: 1.5em;
  line-height: 2rem;
  font-smoothing: antialiased;
  @media (max-width: 1440px) {
    font-size: 1.3em;
  }
  @media (max-width: 1024px) {
    font-size: 1em;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 1.8em;
    line-height: 2.5rem;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    font-size: 1.4em;
    line-height: 1.8rem;
  }
`
