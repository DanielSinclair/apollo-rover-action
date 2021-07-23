# Apollo Rover Fetch Action

A GitHub Action to fetch a managed schema from Apollo Studio using the Apollo [Rover CLI](https://www.apollographql.com/docs/rover/). Prints to log and exports as base64 encoded output `schema`

## inputs
| name       | default | required               |
| :--------- | :------ | :--------------------- |
| graph      |         | yes                    |
| variant    | current | no                     |
| federated  | false   | no                     |
| subgraph   |         | no, if federated false |

## outputs
| name   | description                |
| :----- | :------------------------- |
| schema | base64 encoded fetched SDL |

## Usage
```
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
    - uses: danielsinclair/rover-fetch-action@v1
      with:
        graph: APOLLO_GRAPH_ID
        federated: true
        subgraph: accounts
      env:
        APOLLO_KEY: ${{ secrets.APOLLO_KEY }}
```