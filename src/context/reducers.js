import { ACTIONS } from "./actions"

const langAllTrue = {
  af: true,
  bs: true,
  ca: true,
  ceb: true,
  co: true,
  cs: true,
  cy: true,
  da: true,
  de: true,
  en: true,
  eo: true,
  es: true,
  et: true,
  eu: true,
  fi: true,
  fr: true,
  fy: true,
  ga: true,
  gd: true,
  gl: true,
  ha: true,
  haw: true,
  hmn: true,
  hr: true,
  ht: true,
  hu: true,
  id: true,
  ig: true,
  is: true,
  it: true,
  jw: true,
  ku: true,
  la: true,
  lb: true,
  lt: true,
  lv: true,
  mg: true,
  mi: true,
  ms: true,
  mt: true,
  nl: true,
  no: true,
  ny: true,
  pl: true,
  pt: true,
  ro: true,
  rw: true,
  sk: true,
  sl: true,
  sm: true,
  sn: true,
  so: true,
  sq: true,
  st: true,
  su: true,
  sv: true,
  sw: true,
  tk: true,
  tl: true,
  tr: true,
  uz: true,
  vi: true,
  xh: true,
  yo: true,
  zu: true,
}

const langAllFalse = {
  af: false,
  bs: false,
  ca: false,
  ceb: false,
  co: false,
  cs: false,
  cy: false,
  da: false,
  de: false,
  en: false,
  eo: false,
  es: false,
  et: false,
  eu: false,
  fi: false,
  fr: false,
  fy: false,
  ga: false,
  gd: false,
  gl: false,
  ha: false,
  haw: false,
  hmn: false,
  hr: false,
  ht: false,
  hu: false,
  id: false,
  ig: false,
  is: false,
  it: false,
  jw: false,
  ku: false,
  la: false,
  lb: false,
  lt: false,
  lv: false,
  mg: false,
  mi: false,
  ms: false,
  mt: false,
  nl: false,
  no: false,
  ny: false,
  pl: false,
  pt: false,
  ro: false,
  rw: false,
  sk: false,
  sl: false,
  sm: false,
  sn: false,
  so: false,
  sq: false,
  st: false,
  su: false,
  sv: false,
  sw: false,
  tk: false,
  tl: false,
  tr: false,
  uz: false,
  vi: false,
  xh: false,
  yo: false,
  zu: false,
}

export const initialState = {
  drawerState: "closed",
  characterFilter: "latin",
  langFilter: langAllTrue,
  langFilterAllNone: true,
  wordList: [],
}

function setCharacterFilter(state, characterFilter) {
  localStorage.setItem("characterFilter", characterFilter)
  return { ...state, characterFilter }
}

function setDrawerState(state, drawerState) {
  return { ...state, drawerState }
}

function addToWordList(state, word) {
  const foundWord = state.wordList.find(
    (e) => e.code === word.code && e.search === word.search
  )
  if (foundWord) return state
  return { ...state, wordList: [...state.wordList, word] }
}

function removeFromWordList(state, word) {
  const foundWordIndex = state.wordList.findIndex(
    (e) => e.code === word.code && e.search === word.search
  )

  if (foundWordIndex === -1) return state

  const updatedWordList = [...state.wordList]
  updatedWordList.splice(foundWordIndex, 1)
  return { ...state, wordList: updatedWordList }
}

function clearWordList(state) {
  return { ...state, wordList: [] }
}

function setLangFilter(state, code) {
  if (code === "allnone") {
    const current = state.langFilterAllNone
    const updatedLangFilter = current ? langAllFalse : langAllTrue
    localStorage.setItem("langFilter", JSON.stringify(updatedLangFilter))
    return {
      ...state,
      langFilterAllNone: !current,
      langFilter: updatedLangFilter,
    }
  }

  let langFilterAllNone = state.langFilterAllNone
  const current = state.langFilter[code]
  if (current) langFilterAllNone = false
  else {
    let restLangs = { ...state.langFilter }
    delete restLangs[code]
    if (Object.values(restLangs).every((e) => e)) {
      langFilterAllNone = true
    }
  }

  const updatedLangFilter = { ...state.langFilter, [code]: !current }
  localStorage.setItem("langFilter", JSON.stringify(updatedLangFilter))

  return {
    ...state,
    langFilterAllNone,
    langFilter: updatedLangFilter,
  }
}

function handleSetState(state, updates) {
  return { ...state, ...updates }
}

// function handleReset() {
//   return { ...initialState }
// }

export function reducer(state, action) {
  let newState = state
  switch (action.type) {
    case ACTIONS.SET_CHARACTER_FILTER:
      newState = setCharacterFilter(state, action.payload.characterFilter)
      break
    case ACTIONS.SET_DRAWER_STATE:
      newState = setDrawerState(state, action.payload.drawerState)
      break
    case ACTIONS.ADD_TO_WORD_LIST:
      newState = addToWordList(state, action.payload.word)
      break
    case ACTIONS.REMOVE_FROM_WORD_LIST:
      newState = removeFromWordList(state, action.payload.word)
      break
    case ACTIONS.CLEAR_WORD_LIST:
      newState = clearWordList(state)
      break
    case ACTIONS.SET_LANG_FILTER:
      newState = setLangFilter(state, action.payload.code)
      break
    case ACTIONS.SET_STATE:
      newState = handleSetState(state, action.payload.updates)
      break
    default:
      return state
  }

  // console.log(newState)
  return newState
}
