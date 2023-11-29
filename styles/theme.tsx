import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// 임시로 설정. 추후 수정 필요
let theme = createTheme({
  palette: {
    secondary: {
      main: "#333",
      light: "#efefef",
      dark: "#000",
      contrastText: "#fff",
    },
    info: {
      main: "#9AA8BF",
      light: "#efefef",
      dark: "#889",
      contrastText: "#fff",
    },
    // secondary: {
    //   main: "#F2F2F2",
    //   light: "#ffffff",
    //   dark: "#BDBDBD",
    // },
  },
  typography: {
    button: {
      fontSize: "0.875rem",
      fontWeight: 700,
    },
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.9rem",
    },
    subtitle1: {
      fontSize: "0.8rem",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          maxWidth: "400px",
          padding: "0",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: "0.3rem",
        },
        track: {
          borderRadius: "10rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "2rem !important",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "0.4rem 0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          height: "2rem !important",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
