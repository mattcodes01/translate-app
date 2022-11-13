import { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
// import DomainIcon from "@mui/icons-material/Domain"

import { ACTIONS } from "../context/actions"
import { useAppContext } from "../context/AppContext"
import languages from "../data/languages.json"

export default function TranslatedWord({ text = "", code = "", search = "" }) {
  const { state, dispatch } = useAppContext()
  const [hover, setHover] = useState(false)
  if (!text || !code) return null

  function isInWordList() {
    const foundWordIndex = state.wordList.findIndex(
      (e) => e.code === code && e.search === search
    )
    return foundWordIndex !== -1
  }

  function handleAddWord() {
    dispatch({
      type: ACTIONS.ADD_TO_WORD_LIST,
      payload: {
        word: {
          code,
          text,
          search,
        },
      },
    })
  }

  function handleRemoveWord() {
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

  return (
    <Card
      className="translated-word-card"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <CardContent className="translated-word-card-content">
        <div className="card-text">
          <Typography className={`${!hover ? "hidden" : ""}`} component="div">
            {languages?.[code] || ""}
          </Typography>
          <Typography className="word-text" variant="h5" component="div">
            {text}
          </Typography>
        </div>
        <div className={`card-buttons-container${!hover ? " hidden" : ""}`}>
          <div className="card-buttons-left">
            <a
              href={`https://translate.google.com/?sl=en&tl=${code}&text=${search}&op=translate`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="card-icon-button">
                <VolumeUpIcon />
              </span>
            </a>
            {/* <a
                href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="card-icon-button">
                  <DomainIcon />
                </span>
              </a> */}
          </div>
          <div className="card-buttons-right">
            {isInWordList() ? (
              <RemoveIcon
                className="card-icon-button-remove"
                onClick={handleRemoveWord}
              />
            ) : (
              <AddIcon
                className="card-icon-button-add"
                onClick={handleAddWord}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
