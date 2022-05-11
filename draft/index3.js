import { argv } from 'process'
import { identity } from './mappings/identity.js'
import { output } from './output.js'

function process(value) {
  return identity(value)
}

const input = argv[2]
output(process(input))
