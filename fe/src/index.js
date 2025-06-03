import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import AppLayout from './AppLayout'
import Game, { loader as gameLoader } from './AppLayout/Game'
import GameList, { action as gameListAction, loader as gameListLoader } from './AppLayout/GameList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <GameList />,
        loader: gameListLoader,
        action: gameListAction,
        HydrateFallback: () => null
      },
      { path: 'games/:gameId', element: <Game />, loader: gameLoader }
    ]
  }
])

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
