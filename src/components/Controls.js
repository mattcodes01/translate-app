import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ListIcon from "@mui/icons-material/List"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"

export default function Controls() {
  const { dispatch } = useAppContext()
  function handleOpenList() {
    dispatch({
      type: ACTIONS.SET_DRAWER_STATE,
      payload: { drawerState: "word-list" },
    })
  }

  function handleOpenFilters() {
    dispatch({
      type: ACTIONS.SET_DRAWER_STATE,
      payload: { drawerState: "filters" },
    })
  }

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Button
        onClick={handleOpenList}
        sx={{
          color: "white",
          marginRight: "0 !important",
          "&:hover": { color: "lightgreen" },
        }}
      >
        <ListIcon sx={{ fontSize: "2rem" }} />
      </Button>
      <Button
        onClick={handleOpenFilters}
        sx={{
          color: "white",
          marginLeft: "0 !important",
          "&:hover": { color: "lightgreen" },
        }}
      >
        <FilterAltIcon sx={{ fontSize: "2rem" }} />
      </Button>
    </Box>
  )
}
