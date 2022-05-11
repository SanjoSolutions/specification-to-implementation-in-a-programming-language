import { identifier, stringLiteral } from '@babel/types'
import { readFile } from '@sanjo/read-file'
import { parseGherkin } from './parseGherkin.js'
import { mappings } from './mappings/index.js'
import templateModule from '@babel/template'
import generateModule from '@babel/generator'
const template = templateModule.default
const generate = generateModule.default

const specText = await readFile('./draft/spec.feature')
const spec = parseGherkin(specText)
const scenario = spec.scenarios[0]

const whenStep = scenario.steps[0]
const input = findInput(whenStep.statement)

const thenStep = scenario.steps[1]
const output = findOutput(thenStep.statement)

const mapping = {
  input,
  output
}
const transformName = findTransform(mapping)
const programOutput = generateProgram({transformName})

console.log(programOutput)


function findInput(text) {
  const findInputRegExp = /input "(.*)"/
  const match = findInputRegExp.exec(text)
  const input = match[1]
  return input
}

function findOutput(text) {
  const findOutputRegExp = /outputs "(.*)"/
  const match = findOutputRegExp.exec(text)
  const output = match[1]
  return output
}

function findTransform(mapping) {
  const {input, output} = mapping
  if (input === output) {
    return 'identity'
  }
}

function generateProgram({ transformName }) {
  const generateFromTemplate = template.program(
    `import { argv } from 'process'
import { %%transformName%% } from %%transformImportPath%%
import { output } from './output.js'

function process(value) {
  return %%transformName%%(value)
}

const input = argv[2]
output(process(input))
`
  )

  const ast = generateFromTemplate({
    transformName: identifier(transformName),
    transformImportPath: stringLiteral(`./mappings/${transformName}.js`)
  })

  return generate(ast).code
}
