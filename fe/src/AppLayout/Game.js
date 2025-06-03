import { Link, useLoaderData } from 'react-router'

import { getGame } from '../api'

export default function Game() {
  const { game } = useLoaderData()

  return (
    <div>
      <h3>Game {game.id}</h3>

      <p>Die Size: {game.dieSize}</p>
      <p>Starting HP: {game.startingHP}</p>
      <p>Created At: {new Date(game.createdAt).toLocaleString()}</p>
      {game.players.length > 0 ? (
        <li>
          {game.players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </li>
      ) : (
        <p>No players yet</p>
      )}

      <Link to='/'>Back to Game List</Link>
    </div>
  )
}

export async function loader({ params }) {
  const { game } = await getGame(params.gameId)
  return { game }
}
