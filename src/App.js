import React, { Component } from 'react'
import axios from 'axios'
import styled, { keyframes } from 'styled-components'
import Tree from './Tree'

const Message = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 3em;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const LoadingIndicator = styled.span.attrs({
  role: 'img',
  'aria-label': 'Loading indicator',
})`
  display: inline-block;
  animation: ${rotate360} 1s linear infinite;
`

const Input = styled.input`
  margin-bottom: 1em;
  width: 14em;
  font-size: 1.2rem;
  padding: 0.2em;
`

class App extends Component {
  state = {
    data: null,
    loading: true,
    error: false,
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/data')
      .then(({ data }) =>
        this.setState({
          loading: false,
          data: [data],
        }),
      )
      .catch(err => {
        console.error('Error while fetching data')
        this.setState({
          loading: false,
          error: true,
        })
      })
  }

  onTreeDataChange = treeData => this.setState({ data: treeData })
  onSearchInputChange = event => this.setState({ searchQuery: event.target.value })

  render() {
    const { loading, error, data, searchQuery } = this.state
    return loading ? (
      <Message>
        Loading data... <LoadingIndicator>🌀</LoadingIndicator>
      </Message>
    ) : error ? (
      <Message>There was an error while fetching data.</Message>
    ) : (
      <React.Fragment>
        <Input autoFocus type="text" placeholder="Search" onChange={this.onSearchInputChange} />
        <Tree data={data} onChange={this.onTreeDataChange} searchQuery={searchQuery} />
      </React.Fragment>
    )
  }
}

export default App
