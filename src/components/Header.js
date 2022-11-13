import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Controls from "./Controls"

import logo from "../img/logo.png"

export default function Header({ children }) {
  return (
    <AppBar position="sticky">
      <Container maxWidth={false}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                noWrap
                href="/"
                component="a"
                sx={{
                  padding: "0 10px",
                  marginRight: "5px",
                }}
              >
                <img src={logo} alt="brand logo" className="logo-img" />
              </Box>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  paddingRight: "50px",
                  fontSize: {
                    xs: "1.25rem",
                    lg: "1.5rem",
                  }
                }}
              >
                TRANSLATOR
              </Typography>
            </Box>
            <Controls />
          </Box>
          <Box
            sx={{
              display: "flex",
              paddingBottom: "5px"
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </AppBar>
  )
}
