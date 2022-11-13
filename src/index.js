import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import { createTheme, ThemeProvider } from "@mui/material"
import { AppContextProvider } from "./context/AppContext"

import "./index.css"

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)
