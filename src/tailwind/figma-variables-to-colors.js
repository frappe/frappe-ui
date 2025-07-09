/**
 * This script converts Figma variables JSON exported from the plugin "variables2json"
 * to colors JSON object that can be used in the Tailwind config.
 */

import fs from 'fs'
import path from 'path'

function main() {
  const variables = getVariables()
  const json = convertToJSON(variables)
  const outputPath = path.resolve(__dirname, 'colors.json')
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2))
  console.log('colors.json has been written to', outputPath)
}

function convertToJSON(variables) {
  const output = {
    lightMode: {},
    darkMode: {},
    overlay: {
      white: {},
      black: {},
    },
    neutral: {
      white: '',
      black: '',
    },
    themedVariables: {
      light: {
        outline: {},
        surface: {},
        ink: {},
      },
      dark: {
        outline: {},
        surface: {},
        ink: {},
      },
    },
  }

  const lightPattern = /^light\/([^\/]+)\/([^\/]+)$/
  const darkPattern = /^dark\/([^\/]+)\/([^\/]+)$/
  const neutralPattern = /^neutral\/([^\/]+)$/
  const whiteOverlayPattern = /^white overlay\/([^\/]+)$/
  const blackOverlayPattern = /^black overlay\/([^\/]+)$/

  const colorMap = {}

  // Extract color variables from "Colour primitives" collection
  variables.collections.forEach((collection) => {
    if (collection.name === '🔵 Colour primitives') {
      collection.modes.forEach((mode) => {
        mode.variables.forEach((variable) => {
          const name = variable.name
          let match

          if ((match = name.match(lightPattern))) {
            const [_, color, shade] = match
            if (color === 'white' || color === 'black') {
              output.neutral[color] = variable.value
              colorMap[`light/${color}/${shade}`] = `neutral/${color}`
            } else {
              if (!output.lightMode[color]) {
                output.lightMode[color] = {}
              }
              output.lightMode[color][shade] = variable.value
              colorMap[`light/${color}/${shade}`] =
                `lightMode/${color}/${shade}`
            }
          } else if ((match = name.match(darkPattern))) {
            const [_, color, shade] = match
            if (!output.darkMode[color]) {
              output.darkMode[color] = {}
            }
            output.darkMode[color][shade] = variable.value
            colorMap[`dark/${color}/${shade}`] = `darkMode/${color}/${shade}`
          } else if ((match = name.match(neutralPattern))) {
            const [_, color] = match
            if (color === 'white' || color === 'black') {
              output.neutral[color] = variable.value
              colorMap[`neutral/${color}`] = `neutral/${color}`
            }
          } else if ((match = name.match(whiteOverlayPattern))) {
            const [_, shade] = match
            output.overlay.white[shade] = variable.value
            colorMap[`white overlay/${shade}`] = `overlay/white/${shade}`
          } else if ((match = name.match(blackOverlayPattern))) {
            const [_, shade] = match
            output.overlay.black[shade] = variable.value
            colorMap[`black overlay/${shade}`] = `overlay/black/${shade}`
          }
        })
      })
    }
  })

  // Extract themedVariables for both light and dark modes
  variables.collections.forEach((collection) => {
    if (collection.name === 'Styles') {
      collection.modes.forEach((mode) => {
        mode.variables.forEach((variable) => {
          if (variable.isAlias) {
            const name = variable.name
            const value = variable.value.name
            const [category, colorName] = name.split('/')
            const targetCategory = category === 'text-icons' ? 'ink' : category
            if (
              mode.name === 'Light' &&
              output.themedVariables.light[targetCategory]
            ) {
              if (colorMap[value]) {
                output.themedVariables.light[targetCategory][colorName] =
                  colorMap[value]
              } else {
                console.warn(`Reference not found for value: ${value}`)
              }
            } else if (
              mode.name === 'Dark' &&
              output.themedVariables.dark[targetCategory]
            ) {
              if (colorMap[value]) {
                output.themedVariables.dark[targetCategory][colorName] =
                  colorMap[value]
              } else {
                console.warn(`Reference not found for value: ${value}`)
              }
            } else {
              console.warn(`Unexpected category: ${category}`)
            }
          }
        })
      })
    }
  })

  return output
}

function getVariables() {
  const variablesJSONPath = process.argv[2]
  if (variablesJSONPath == null) {
    console.log('Please provide path to variables.json file')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(variablesJSONPath, 'utf-8'))
}

main()
