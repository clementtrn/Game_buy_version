import { createMuiTheme } from '@material-ui/core/styles';
import Agency from './fonts/Agency FB.ttf';

const agency = {
  fontFamily: 'Agency FB',
  fontStyle: 'normal',
  // fontDisplay: 'swap',
  // fontWeight: 400,
  src: `
    local('Agency FB'),
    local('Agency FB-Regular'),
    url(${Agency}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};



const MyTheme = createMuiTheme({
    palette: {
      primary: {
        main:"#F02000",
      },
     
    },

    typography: {
      fontFamily: " Agency FB, Arial",
      fontSize:20,
     
    },
   
  });

  MyTheme.typography.h1 = {
    fontSize: '3em',
    
    fontFamily: 'Agency FB, Arial',
    '@media (min-width:600px)': {
      fontSize: '3rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  };


  MyTheme.typography.h2 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
  };

  MyTheme.typography.h5 = {
    fontSize: '1.4em',
    // lineHeight:"1em",
    fontWeight:"bold",

    fontFamily: 'Agency FB,sans-serif',
    '@media (min-width:600px)': {
      fontSize: '1rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '1.4rem',
    },
  };
  MyTheme.typography.h6 = {
    fontSize: '0.9em',
    fontWeight:"normal",
    
    lineHeight:"1em",
    // fontWeight:"bold",

    fontFamily: 'Arial,sans-serif',
    '@media (min-width:600px)': {
      fontSize: '0.7rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
  };

  MyTheme.typography.subtitle1= {
    fontSize: '1.3em',
    // fontWeight:"bold",

    fontFamily: 'Arial,sans-serif',
    '@media (min-width:600px)': {
      fontSize: '1rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  };
  MyTheme.typography.subtitle2= {
    fontSize: '1em',
    lineHeight:"1em",
    // fontWeight:"bold",

    fontFamily: 'Arial,sans-serif',
    '@media (min-width:600px)': {
      fontSize: '0.5rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  };

  MyTheme.typography.caption= {
    fontSize: '3em',
    fontFamily: 'Agency FB, Arial',
    '@media (min-width:600px)': {
      fontSize: '3rem',
    },
    [MyTheme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  };
export default MyTheme