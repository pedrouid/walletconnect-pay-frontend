export const colors = {
  white: "255, 255, 255",
  black: "0, 0, 0",
  dark: "45, 42, 42",
  darkGrey: "113, 119, 138",
  grey: "155, 177, 187",
  lightGrey: "242, 242, 251",
  blue: "101, 127, 230",
  lightBlue: "64, 153, 255",
  yellow: "250, 188, 45",
  orange: "246, 133, 27",
  green: "41, 203, 174",
  pink: "255, 51, 102",
  red: "214, 75, 71",
  purple: "110, 107, 233",
  background: "40, 44, 52"
};

export const fonts = {
  size: {
    tiny: "10px",
    small: "12px",
    medium: "16px",
    large: "18px",
    h1: "48px",
    h2: "40px",
    h3: "32px",
    h4: "28px",
    h5: "24px",
    h6: "18px"
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  family: {
    OpenSans: '"Open Sans", sans-serif'
  }
};

export const transitions = {
  short: "all 0.1s ease-in-out",
  base: "all 0.2s ease-in-out",
  long: "all 0.3s ease-in-out"
};

export const shadows = {
  base: "0 5px 8px 0 rgba(239, 239, 239, 0.25)",
  hover: "0 9px 11px 0 rgba(239, 239, 239, 0.22)"
};

export const responsive = {
  xs: {
    min: "min-width: 479px",
    max: "max-width: 480px"
  },
  sm: {
    min: "min-width: 639px",
    max: "max-width: 640px"
  },
  md: {
    min: "min-width: 959px",
    max: "max-width: 960px"
  },
  lg: {
    min: "min-width: 1023px",
    max: "max-width: 1024px"
  },
  xl: {
    min: "min-width: 1399px",
    max: "max-width: 1400px"
  }
};

export const globalStyle = `
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700,800');

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${fonts.family.OpenSans};
    font-style: normal;
    font-stretch: normal;
    font-weight: ${fonts.weight.normal};
    font-size: ${fonts.size.medium};
    background-color: rgb(${colors.white});
    color: rgb(${colors.dark});
    overflow-y:auto;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  	-webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;  
  }

  button {
    border-style: none;
    line-height: 1em;
    background-image: none;
    outline: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }

  [tabindex] {
    outline: none;
    width: 100%;
    height: 100%;
  }

  a, p, h1, h2, h3, h4, h5, h6 {
  	text-decoration: none;
  	margin: 0;
    padding: 0;
    margin: 0.7em 0;
  }

  h1 {
    font-size: ${fonts.size.h1}
  }
  h2 {
    font-size: ${fonts.size.h2}
  }
  h3 {
    font-size: ${fonts.size.h3}
  }
  h4 {
    font-size: ${fonts.size.h4}
  }
  h5 {
    font-size: ${fonts.size.h5}
  }
  h6 {
    font-size: ${fonts.size.h6}
  }

  a {
    background-color: transparent;
    -webkit-text-decoration-skip: objects;  
    text-decoration: none;
    color: inherit;
    outline: none;
  }

  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  ul, li {
  	list-style: none;
  	margin: 0;
  	padding: 0;
  }

  * {
    box-sizing: border-box !important;
  }


  input {
    -webkit-appearance: none;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
  }
  audio,
  canvas,
  progress,
  video {
    display: inline-block;
  }

  input[type="color"],
  input[type="date"],
  input[type="datetime"],
  input[type="datetime-local"],
  input[type="email"],
  input[type="month"],
  input[type="number"],
  input[type="password"],
  input[type="search"],
  input[type="tel"],
  input[type="text"],
  input[type="time"],
  input[type="url"],
  input[type="week"],
  select:focus,
  textarea {
    font-size: 16px;
  }
`;
