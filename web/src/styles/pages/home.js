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
`
export const UntitledIntro = styled.article`
  width: 30vw;
  grid-column-start: 3;
  margin-top: 15rem;
`
export const UntitledParagraph = styled.p`
  color: #fff;
  font-size: 1.5em;
  line-height: 2rem;
`
