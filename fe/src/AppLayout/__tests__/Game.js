import React from 'react'
import { createRoutesStub } from 'react-router'

import { http, HttpResponse } from 'msw'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { server } from '../../../mocks/api'
import Game, { loader as gameLoader, joinAction as joinGameAction } from '../Game'

describe('GameList', () => {
  const RouteStub = createRoutesStub([
    {
      path: '/games/:gameId',
      Component: Game,
      loader: gameLoader,
      HydrateFallback: () => null
    },
    {
      path: '/games/:gameId/join',
      action: joinGameAction
    }
  ])

  it('renders a game', async () => {
    render(<RouteStub initialEntries={['/games/15d42a4d-1948-4de4-ba78-b8a893feaf45']} />)

    expect(await screen.findByText('Game 15d42a4d-1948-4de4-ba78-b8a893feaf45')).toBeInTheDocument()

    expect(screen.getByText('Die Size: 6')).toBeInTheDocument()
    expect(screen.getByText('Starting HP: 10')).toBeInTheDocument()
    expect(screen.getByText('No players yet')).toBeInTheDocument()
  })

  it('can join a game', async () => {
    render(<RouteStub initialEntries={['/games/15d42a4d-1948-4de4-ba78-b8a893feaf45']} />)

    expect(await screen.findByText('Game 15d42a4d-1948-4de4-ba78-b8a893feaf45')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Player Name' }), 'John Doe')

    // XXX: Disabled until https://github.com/mswjs/jest-fixed-jsdom/issues/32 is fixed.

    // await userEvent.click(screen.getByRole('button', { name: 'Join Game' }))

    // expect(await screen.findByText('John Doe')).toBeInTheDocument()
  })

  it('can start a game', async () => {
    server.use(
      http.get('/api/games/:gameId', ({ params }) => {
        return HttpResponse.json({
          game: {
            id: params.gameId,
            dieSize: 6,
            startingHP: 10,
            createdAt: '2025-01-01T00:00:00.000Z',
            players: [
              {
                id: 'aed2e347-bb72-4c3d-b938-a31c62e0bd64',
                name: 'John Doe',
                hp: 10
              },
              {
                id: 'e2837989-2e76-4156-8d06-fba52ea6f29d',
                name: 'Jane Doe',
                hp: 10
              }
            ]
          }
        })
      })
    )

    render(<RouteStub initialEntries={['/games/15d42a4d-1948-4de4-ba78-b8a893feaf45']} />)

    expect(await screen.findByText('Game 15d42a4d-1948-4de4-ba78-b8a893feaf45')).toBeInTheDocument()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()

    // XXX: Disabled until https://github.com/mswjs/jest-fixed-jsdom/issues/32 is fixed.
    // await userEvent.click(screen.getByRole('button', { name: 'Start Game' }))
  })
})
