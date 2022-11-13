import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"

export default function FilterControls() {
  const { dispatch, state } = useAppContext()
  function handleCharacterFilterChange(e) {
    dispatch({
      type: ACTIONS.SET_CHARACTER_FILTER,
      payload: {
        characterFilter: e.target.value,
      },
    })
  }

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Include</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={state.characterFilter}
        onChange={handleCharacterFilterChange}
      >
        <div>
          <FormControlLabel value="latin" control={<Radio />} label="A-Z" />
        </div>
        <div>
          <FormControlLabel
            value="extended"
            control={<Radio />}
            label="Extended"
          />
        </div>
      </RadioGroup>
    </FormControl>
  )
}
