import { useEffect, useState } from "react"
import TranslatedWord from "./components/TranslatedWord"
import LoadingSpinner from "./components/LoadingSpinner"
import Drawer from "./components/Drawer"
import Header from "./components/Header"
import Search from "./components/Search"

import { CustomError } from "./util/CustomError"
import { useAppContext } from "./context/AppContext"
import { ACTIONS } from "./context/actions"

import "./App.css"

function App() {
  const { state, dispatch } = useAppContext()
  const [translatedWords, setTranslatedWords] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [prevSearch, setPrevSearch] = useState(null)
  const [randomWord, setRandomWord] = useState(null)

  const baseUrl = "http://localhost:3001/"

  async function handleSearch(searchText) {
    if (loading) return
    let query = ""
    let random = false
    if (searchText.length !== 0) {
      if (searchText.length < 2 || searchText.length > 30) return
      console.log("searchText --", searchText)
      console.log("prevSearch --", prevSearch)
      if (searchText === prevSearch) return
      query = `word=${searchText.trim()}`
    } else {
      random = true
      query = "random=true"
    }
    try {
      // setPrevSearch(searchText)
      if (!random) setPrevSearch(searchText)
      setLoading(true)
      setError(null)
      setRandomWord(null)
      const res = await fetch(`${baseUrl}?${query}`)
      if (res.status === 204) throw new CustomError("Translation not available")
      if (res.status === 400) throw new CustomError("Error getting translation")
      if (res.status === 500) throw new CustomError("Error getting translation")
      if (res.status !== 200) throw new CustomError("Error getting translation")
      const {word, translations} = await res.json()
      if (!Array.isArray(translations)) {
        throw new CustomError("Error getting translation")
      }
      if (random) {
        setRandomWord(word)
        setPrevSearch(word)
      }
      setTranslatedWords(translations)
    } catch (e) {
      if (e instanceof CustomError) {
        setError(e.message)
      } else {
        setError("Error getting translation")
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    let updates = null
    const characterFilter = localStorage.getItem("characterFilter")
    const langFilter = localStorage.getItem("langFilter")

    if (characterFilter || langFilter) {
      updates = {}
    }

    if (characterFilter) updates.characterFilter = characterFilter
    if (langFilter) {
      try {
        const langFilterValue = JSON.parse(langFilter)
        updates.langFilter = langFilterValue
        updates.langFilterAllNone = Object.values(langFilterValue).every(
          (e) => e
        )
      } catch {}
    }

    if (updates) {
      dispatch({
        type: ACTIONS.SET_STATE,
        payload: {
          updates,
        },
      })
    }
  }, [])

  function renderTranslatedWords() {
    if (loading) return <LoadingSpinner />
    if (error) return <div className="error-msg">{error}</div>
    if (!Array.isArray(translatedWords)) {
      return <div className="error-msg">Error getting translation</div>
    }

    if (!Object.values(state.langFilter).some((e) => e)) {
      return <div className="error-msg">No languages selected in filter</div>
    }

    let filteredWords = translatedWords
    if (state.characterFilter === "latin") {
      filteredWords = filteredWords.filter((word) => {
        return /^[A-Za-z]+$/.test(word?.text)
      })
    }

    filteredWords = filteredWords.sort((a, b) => (a.code < b.code ? -1 : 0))
    filteredWords = filteredWords.filter((word) => state.langFilter[word.code])

    return (
      <div className="translated-words-grid">
        {filteredWords.map((translatedWord) => {
          return (
            <TranslatedWord
              key={translatedWord.code}
              text={translatedWord.text}
              code={translatedWord.code}
              search={randomWord || prevSearch}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="App">
      <Header>
        <Search handleSearch={handleSearch} value={randomWord} />
      </Header>
      <main>
        <Drawer />
        {renderTranslatedWords()}
      </main>
    </div>
  )
}

export default App
