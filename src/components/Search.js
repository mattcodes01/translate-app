import { useState, useRef } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import SearchIcon from "@mui/icons-material/Search"

export default function Search({ handleSearch, value }) {
  const [searchText, setSearchText] = useState("")
  // const [selectionStart, setSelectionStart] = useState(null)
  // const [selectionEnd, setSelectionEnd] = useState(null)
  // const [textChanged, setTextChanged] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  // const searchTextRef = useRef(null)

  function handleFormSubmit(e) {
    e.preventDefault()
    handleSearch(searchText)
  }

  // // useLayoutEffect(() => {
  // useEffect(() => {
  //   // searchTextRef.current.selectionStart = selectionStart
  //   // searchTextRef.current.selectionEnd = selectionEnd
  //   searchTextRef.current.setSelectionRange(selectionEnd, selectionEnd)
  // }, [textChanged])

  function handleSearchTextChange(e) {
    // const {selectionStart, selectionEnd } = e.target
    // const {selectionStart, selectionEnd } = searchTextRef.current
    // setSelectionStart(selectionStart)
    // setSelectionEnd(selectionEnd)
    // setTextChanged({})
    if(/[^A-Za-z]/.test(e.target.value)) return
    setSearchText(e.target.value)
    // const searchInputValue = e.target.value.replace(/[^A-Za-z]/g, "")
    // setSearchText(searchInputValue)
  }

  if (value !== prevValue) {
    setSearchText(value || searchText)
    setPrevValue(value)
  }

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        width: "100%",
        display: "flex",
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <input
        type="text"
        // ref={searchTextRef}
        placeholder="word"
        onInput={handleSearchTextChange}
        value={searchText}
        className="search-input"
        maxLength="30"
      />
      <Button
        type="submit"
        variant="outlined"
        sx={{
          color: "white",
          border: "1.5px solid white",
          width: "5px",
          height: "75%",
          margin: 0,
          "&:hover": {
            border: "1.5px solid white",
            boxShadow: "inset 0 0 0 1px #fff",
          },
        }}
      >
        <SearchIcon sx={{ fontSize: "2rem" }} />
      </Button>
    </Box>
  )
}
