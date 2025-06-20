import { Link, useFetcher, useLoaderData } from 'react-router'

import { getGame, joinGame, startGame } from '../api'

export default function Game() {
  const { game } = useLoaderData()
  const fetcher = useFetcher()

  return (
    <div>
      <h3>Game {game.id}</h3>

      <p>Die Size: {game.dieSize}</p>
      <p>Starting HP: {game.startingHP}</p>
      <p>Created At: {new Date(game.createdAt).toLocaleString()}</p>
      {game.players.length > 0 ? (
        <ul>
          {game.players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      ) : (
        <p>No players yet</p>
      )}

      <fetcher.Form action={`/games/${game.id}/join`} method='post'>
        <label htmlFor='playerName'>Player Name</label>
        <input type='text' name='playerName' placeholder='John Doe' required />

        <button type='submit' disabled={fetcher.state !== 'idle'}>
          Join Game
        </button>
      </fetcher.Form>

      <fetcher.Form action={`/games/${game.id}/start`} method='post'>
        <button type='submit' disabled={fetcher.state !== 'idle'}>
          Start Game
        </button>
      </fetcher.Form>

      <Link to='/'>Back to Game List</Link>
    </div>
  )
}

export async function loader({ params }) {
  const { game } = await getGame(params.gameId)
  return { game }
}

export async function startAction({ params }) {
  const { game } = await startGame(params.gameId)
  return { game }
}

export async function joinAction({ params, request }) {
  const formData = await request.formData()
  const playerName = formData.get('playerName')
  const { game } = await joinGame(params.gameId, playerName)
  return { game }
}
