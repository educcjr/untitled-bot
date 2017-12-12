import { injectGlobal } from 'styled-components';

export default () => injectGlobal`
  html {
  box-sizing: border-box;
  }
  *, *:before, *:after {
  box-sizing: inherit;
  }
`
