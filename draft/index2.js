import process from 'process'

function run(value) {
  return value
}

function output(value) {
  console.log(value)
}

const input = process.argv[2]
output(run(input))
