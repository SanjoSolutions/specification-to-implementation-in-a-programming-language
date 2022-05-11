export function parseGherkin(value) {
  const lines = value.split('\n')
  const stepRegExp = /(Given|When|Then) (.+)/
  let feature
  let scenario
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('Feature: ')) {
      const featureRegExp = /Feature: (.+)/
      const match = featureRegExp.exec(trimmedLine)
      feature = {
        type: 'feature',
        name: match[1],
        scenarios: []
      }
    } else if (trimmedLine.startsWith('Scenario: ')) {
      const scenarioRegExp = /Scenario: (.+)/
      const match = scenarioRegExp.exec(trimmedLine)
      scenario = {
        type: 'scenario',
        name: match[1],
        steps: []
      }
      feature.scenarios.push(scenario)
    } else if (stepRegExp.test(trimmedLine)) {
      const step = {
        type: 'step',
        statement: trimmedLine,
      }
      scenario.steps.push(step)
    }
  }

  return feature
}
