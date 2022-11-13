import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep"
import FileDownloadIcon from "@mui/icons-material/FileDownload"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"
import languages from "../data/languages.json"

export default function WordList() {
  const { state, dispatch } = useAppContext()

  function handleClearWordList() {
    dispatch({
      type: ACTIONS.SET_DRAWER_STATE,
      payload: { drawerState: "closed" },
    })
    dispatch({ type: ACTIONS.CLEAR_WORD_LIST })
  }

  function handleWordListClose() {
    dispatch({
      type: ACTIONS.SET_DRAWER_STATE,
      payload: { drawerState: "closed" },
    })
  }

  function handleWordDelete(code, search) {
    dispatch({
      type: ACTIONS.REMOVE_FROM_WORD_LIST,
      payload: {
        word: {
          code,
          search,
        },
      },
    })
  }

  function handleCsvDownload() {
    let csv = "Word,Translation,Lanugage\n"
    for (let word of state.wordList) {
      csv += `${word.search},${word.text},${languages[word.code]}\n`
    }

    // https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    )
    element.setAttribute("download", "words.csv")

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      {!state.wordList.length ? (
        <div>Word list empty</div>
      ) : (
        <>
          <div className="word-list-controls">
            <Tooltip title="Clear list">
              <IconButton onClick={handleClearWordList}>
                <DeleteSweepIcon sx={{ fontSize: "2rem" }}>
                  clear list
                </DeleteSweepIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Download CSV">
              <IconButton onClick={handleCsvDownload}>
                <FileDownloadIcon sx={{ fontSize: "2rem" }}>
                  download csv
                </FileDownloadIcon>
              </IconButton>
            </Tooltip>
            <CloseIcon
              sx={{ cursor: "pointer", fontSize: "2rem", alignSelf: "center" }}
              onClick={handleWordListClose}
            />
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#e2e8f0" }}>
                <TableRow>
                  <TableCell align="right">Word</TableCell>
                  <TableCell align="right">Translation</TableCell>
                  <TableCell align="right">Language</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.wordList.map((row) => (
                  <TableRow
                    key={`${row.code}-${row.search}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f9fafb" },
                    }}
                  >
                    <TableCell align="right">{row.search}</TableCell>
                    <TableCell align="right">{row.text}</TableCell>
                    <TableCell align="right">{languages[row.code]}</TableCell>
                    <TableCell align="right">
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleWordDelete(row.code, row.search)}
                      >
                        delete word
                      </DeleteIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}
