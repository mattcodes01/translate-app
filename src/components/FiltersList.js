import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import Divider from "@mui/material/Divider"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import FilterControls from "./FilterControls"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"
import languages from "../data/languages.json"

export default function FiltersList() {
  const { state, dispatch } = useAppContext()

  function handleFilterChange(e, code) {
    e.preventDefault()
    e.stopPropagation()
    dispatch({
      type: ACTIONS.SET_LANG_FILTER,
      payload: { code },
    })
  }

  return (
    <Box role="presentation">
      <FilterControls />
      <Divider />
      <List>
        <ListItem key={"allnone"} disablePadding>
          <ListItemButton
            onClick={(e) => handleFilterChange(e, "allnone")}
            sx={{
              paddingLeft: "5px",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.langFilterAllNone}
                    sx={{
                      "&:hover": {
                        background: "none",
                      },
                    }}
                  />
                }
                label="All / None"
              />
            </FormGroup>
          </ListItemButton>
        </ListItem>
        {Object.entries(languages).map(([code, language]) => (
          <ListItem key={code} disablePadding>
            <ListItemButton
              onClick={(e) => handleFilterChange(e, code)}
              sx={{
                paddingLeft: "5px",
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.langFilter[code]}
                      sx={{
                        "&:hover": {
                          background: "none",
                        },
                      }}
                    />
                  }
                  label={language}
                />
              </FormGroup>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
