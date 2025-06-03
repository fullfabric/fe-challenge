import React from 'react'
import { createRoutesStub } from 'react-router'

import { render, screen } from '@testing-library/react'

import GameList, { action as gameListAction, loader as gameListLoader } from '../GameList'

describe('GameList', () => {
  const RouteStub = createRoutesStub([
    {
      path: '/',
      Component: GameList,
      action: gameListAction,
      loader: gameListLoader,
      HydrateFallback: () => null
    }
  ])

  it('renders a list of games', async () => {
    render(<RouteStub initialEntries={['/']} />)

    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()

    const rows = await screen.findAllByRole('row')
    expect(rows).toHaveLength(2)

    expect(screen.getByText('15d42a4d-1948-4de4-ba78-b8a893feaf45')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
