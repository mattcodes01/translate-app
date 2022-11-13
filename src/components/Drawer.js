import { useTheme } from "@mui/material/styles"
import Drawer from "@mui/material/Drawer"
import FiltersList from "./FiltersList"
import WordList from "./WordList"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"

export default function TemporaryDrawer() {
  const theme = useTheme()
  const { state, dispatch } = useAppContext()
  const setDrawerState = (state) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    dispatch({
      type: ACTIONS.SET_DRAWER_STATE,
      payload: { drawerState: state },
    })
  }

  function renderDrawerContent() {
    switch (state.drawerState) {
      case "word-list":
        return <WordList />
      case "filters":
        return <FiltersList />
      default:
        return null
    }
  }

  return (
    <div>
      <Drawer
        anchor={"right"}
        open={state.drawerState !== "closed"}
        onClose={setDrawerState("closed")}
        variant="temporary"
        transitionDuration={{
          enter: theme.transitions.duration.enteringScreen,
          exit: 0,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="drawer-content">{renderDrawerContent()}</div>
      </Drawer>
    </div>
  )
}
