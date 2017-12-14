import styled from 'styled-components';

export const FormWrapper = styled.div`
  grid-column-start: 3;
  grid-row-start: 3;
  background-color: #fff;
  width: 25vw;
  border-radius: 0.4rem;
  border-bottom: 0.2rem solid rgba(102, 206, 217, 1);
  @media (max-width: 1440px) {
    width: 26.5vw;
  }
  @media (max-width: 1024px) {
    grid-column-start: 2;
    margin-left: 3.9rem;
    width: 35vw;
  }
  @media (max-width: 768px) {
    grid-column-start: 1;
    margin-left: 1rem;
    width: 60vw;
  }
  @media (max-width: 768px) {
    grid-column-start: 1;
    margin-left: 1rem;
    width: 60vw;
  }
  @media (max-width: 425px) and (orientation: portrait) {
    grid-column-start: 1;
    width: 100vw;
    border-radius: 0;
    margin-left: 0;
  }
`
export const UntitledForm = styled.form`
  padding: 1rem 3rem;
  border-bottom: 0.05rem solid #ccc;
`
export const UntitledSelect = styled.select`
  width: 15vw;
  height: 5vh;
  outline: none;
  border: none;
  border-bottom: 0.1rem solid rgba(102, 206, 217, 1);
  font-weight: 300;
  margin-bottom: 1rem;
  position: relative;
  @media (max-width: 768px) {
    width: 40vw;
  }
`
