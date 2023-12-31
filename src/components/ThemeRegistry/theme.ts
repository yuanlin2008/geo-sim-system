import { createTheme } from "@mui/material/styles"

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
})

export default defaultTheme
