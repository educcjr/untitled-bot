import styled from 'styled-components';
import {
  lightTeal,
  halfTeal,
} from '../base/variables';

export const FileUpload = styled.input`
width:210px;
opacity: 0;
overflow: hidden;
position: absolute;
z-index: 1;
cursor: pointer;
`
export const FilePicker = styled.label`
  border: 2px solid black;
  border-image:linear-gradient(to top right, ${halfTeal}, ${lightTeal}) 1 repeat stretch;
  border-radius: 0.2rem;
  padding: 0.5rem 2rem;
  color: ${halfTeal};
  text-transform: uppercase;
  font-weight: 400;
  cursor: pointer;
  display: inline-block;
`
export const Submit = styled.input`
  background: linear-gradient(to top right, ${halfTeal}, ${lightTeal});
  border: none;
  outline: none;
  padding: 0.5rem 2rem;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: .8rem;
  letter-spacing: 1px;
`
