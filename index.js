
const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')

const rover = async (args = []) => {
  let schema = ""
  const stdout = (data) => schema += data.toString()
  const listeners = { stdout }
  const options = { listeners }
  await exec.exec("/root/.rover/bin/rover", args, options)
  return schema
}

const getInput = () => {
  const graph = core.getInput('graph')
  const variant = core.getInput('variant')
  const federated = core.getInput('federated')
  const subgraph = core.getInput('subgraph')
  if (federated && !subgraph) throw new Error('federated graph requires subgraph input')
  const path = federated ? `./${subgraph}.graphql` : `./graph.graphql`
  return { graph, variant, federated, subgraph, path }
}

const setOutput = (path, schema) => {
  fs.writeFileSync(path, schema)
  core.setOutput('path', path)
  const encoded = Buffer.from(schema).toString('base64')
  core.setOutput('schema', encoded)
}

async function run() {
  try {
    const { graph, variant, federated, subgraph, path } = getInput()
    const name = federated ? ['--name', subgraph] : []
    const args = [
      federated ? 'subgraph' : 'graph',
      'fetch',
      `${graph}@${variant}`,
      ...name
    ]
    const schema = await rover(args)
    setOutput(path, schema)
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()