import { process } from 'process'

function printInput() {
  const input = process.argv[2]
  output(input)
}

function output(value) {
  console.log(value)
}

printInput()
