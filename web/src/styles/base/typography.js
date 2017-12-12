import { injectGlobal } from 'styled-components';

export default () => injectGlobal`
  @font-face {
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 300;
  src: local('Source Code Pro Light'), local('SourceCodePro-Light'), url(https://fonts.gstatic.com/s/sourcecodepro/v7/leqv3v-yTsJNC7nFznSMqeode0-EuMkY--TSyExeINg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
  }
  @font-face {
    font-family: 'Source Code Pro';
    font-style: normal;
    font-weight: 400;
    src: local('Source Code Pro'), local('SourceCodePro-Regular'), url(https://fonts.gstatic.com/s/sourcecodepro/v7/mrl8jkM18OlOQN8JLgasD9V_2ngZ8dMf8fLgjYEouxg.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
  }
  @font-face {
    font-family: 'Source Code Pro';
    font-style: normal;
    font-weight: 700;
    src: local('Source Code Pro Bold'), local('SourceCodePro-Bold'), url(https://fonts.gstatic.com/s/sourcecodepro/v7/leqv3v-yTsJNC7nFznSMqUo0As1BFRXtCDhS66znb_k.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
  }
`
