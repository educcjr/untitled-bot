import styled from 'styled-components'

export const AudioContainer = styled.section`
  padding: 1rem 3rem;
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 60% 40%;
  `

export const ThirdHeader = styled.h3`
  font-weight: 400;
  color: #2b7880;
  margin-bottom: 2rem;
  grid-column-start: 1;
  @media (max-width: 1440px) {
    font-size: 1.35em;
  }
`
export const PlayList = styled.div`
  grid-column-start: 1;
`
export const AudioGrid = styled.div`
  display: grid;
  grid-template-columns: 65% 35%;
  grid-template-rows: auto;
  grid-column-gap: 12rem;
  @media (max-width: 1440px) {
    grid-column-gap: 8rem;
  }
`

export const Audio = styled.div`
  font-weight: 400;
  cursor: pointer;
  position: relative;
  background: #fff;
`

export const DeleteButton = styled.button`
  grid-column-start: 2;
  background:transparent;
  border: none;
  outline: none;
  cursor: pointer;
`
