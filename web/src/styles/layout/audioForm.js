import styled from 'styled-components';

export const FormWrapper = styled.div`
  grid-column-start: 3;
  grid-row-start: 3;
  background-color: #fff;
  width: 25vw;
  border-radius: 0.4rem;
  border-bottom: 0.2rem solid rgba(102, 206, 217, 1);
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
`
export const UntitledOption = styled.option`
  border-bottom: 1px solid red;
`
