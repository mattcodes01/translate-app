const path = require("path")
const AWS = process.env.NODE_ENV !== "local" && require("aws-sdk")
const { Translate } = require("@google-cloud/translate").v2

const {
  project_id: projectId,
} = require("./private/translateapp-serviceacct-key.json")

const languages = require("./languages.json")
const englishWordsList = require("./words.json")
const commonWordsList = require("./words-common.json")

const RESPONSE_STRINGS = {
  INVALID_REQUEST: "Invalid Request",
  TRANSLATION_NOT_AVAILABLE: "Translation not available",
  SERVER_ERROR: "Server Error",
}

const TABLE_NAMES = {
  TRANSLATE: "TranslatedWords",
}

const longestWordLength = 30

const client =
  process.env.NODE_ENV !== "local" && new AWS.DynamoDB({ region: "us-east-1" })

const keyFile = "translateapp-serviceacct-key.json"
const keyFilename = path.join(__dirname, "private", keyFile)
const translate = new Translate({ projectId, keyFilename })

function createApiResponse(code, data) {
  const response = {
    statusCode: code,
    body: JSON.stringify(data),
  }

  return response
}

// console.log(JSON.stringify(await translate.getLanguages("en")))
async function getTranslations(word) {
  const translations = []
  const translationPromises = []

  for (let language of languages) {
    const { code } = language
    translationPromises.push(translate.translate(word, code))
  }

  const translationValues = await Promise.all(translationPromises)
  for (let i = 0; i < translationValues.length; i++) {
    let translationValue = translationValues[i]
    let translation = translationValue[0]
    // translation = Array.isArray(translation) ? translation : [translation]
    if (translation !== word) {
      translations.push({
        text: translation,
        code: languages[i].code,
      })
    }
  }

  return translations
}

async function runDatabaseCommand(command, params) {
  if (process.env.NODE_ENV === "local") return {}

  let result = null

  try {
    if (command === "getItem") {
      result = await client.getItem(params).promise()
    } else if (command === "putItem") {
      result = await client.putItem(params).promise()
    } else {
      console.log("Not a valid db command: ", command)
    }
  } catch (err) {
    console.error(err)
    throw new Error("db error")
  }

  return result
}

function createPutItem(attributes) {
  const putItem = {
    word: {
      S: attributes.word,
    },
  }

  for (let translation of attributes.translations) {
    if (!translation?.code) continue
    putItem[translation.code] = { S: translation?.text }
  }

  return putItem
}

function createParams(type, attributes, table) {
  switch (type) {
    case "getItem":
      return {
        Key: {
          word: {
            S: attributes.word,
          },
        },
        TableName: table,
      }
    case "putItem":
      return {
        Item: createPutItem(attributes),
        TableName: table,
      }
    default:
      return {}
  }
}

function formatResponse(dbItem) {
  const response = []
  delete dbItem.word
  if (!dbItem) return response
  Object.entries(dbItem).forEach(([key, value]) =>
    response.push({
      text: value?.S,
      code: key,
    })
  )

  return response
}

exports.handler = async (event) => {
  try {
    let word = event?.queryStringParameters?.word
    let random = event?.queryStringParameters?.random

    // console.log("event.body", event.body)
    // let word = event.body.word

    if (random === "true") {
      const randIndex = Math.floor(Math.random() * commonWordsList.length)
      word = commonWordsList[randIndex]
    } else {
      if (!word) {
        return createApiResponse(400, RESPONSE_STRINGS.INVALID_REQUEST)
      }
      if (typeof word !== "string") {
        return createApiResponse(400, RESPONSE_STRINGS.INVALID_REQUEST)
      }

      word = word.trim()
      word = word.toLowerCase()

      if (word.length < 2 || word.length > longestWordLength) {
        return createApiResponse(
          204,
          RESPONSE_STRINGS.TRANSLATION_NOT_AVAILABLE
        )
      }
      if (!/^[a-z]+$/.test(word)) {
        return createApiResponse(400, RESPONSE_STRINGS.INVALID_REQUEST)
      }
      if (!englishWordsList.includes(word)) {
        return createApiResponse(
          204,
          RESPONSE_STRINGS.TRANSLATION_NOT_AVAILABLE
        )
      }
    }

    const getItemParams = createParams(
      "getItem",
      { word },
      TABLE_NAMES.TRANSLATE
    )
    const dbGetResponse = await runDatabaseCommand("getItem", getItemParams)
    if (!dbGetResponse) {
      return createApiResponse(500, RESPONSE_STRINGS.SERVER_ERROR)
    }
    if (dbGetResponse.Item) {
      const response = formatResponse(dbGetResponse.Item)
      return createApiResponse(200, {word, translations: response})
    }

    const translations = await getTranslations(word)
    const putItemParams = createParams(
      "putItem",
      { word, translations },
      TABLE_NAMES.TRANSLATE
    )
    const dbPutResponse = await runDatabaseCommand("putItem", putItemParams)
    console.log("DB PUT RESPONSE", dbPutResponse)
    return createApiResponse(200, {word, translations})
  } catch (error) {
    console.log("error:", error)
    return createApiResponse(500, RESPONSE_STRINGS.SERVER_ERROR)
  }
}
