import { Form, Link, useLoaderData } from 'react-router'

import { createGame, listGames } from '../api'

import styles from './GameList/styles.module.scss'

export default function GameList() {
  const { games } = useLoaderData()

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Die Side</th>
            <th>Starting HP</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {games.length ? (
            games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.dieSize}</td>
                <td>{game.startingHP}</td>
                <td>{new Date(game.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/games/${game.id}`}>View</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No games yet</td>
            </tr>
          )}
        </tbody>
      </table>

      <Form method='post'>
        <button className={styles.createGameButton} type='submit'>
          Create Game
        </button>
      </Form>
    </>
  )
}

export async function loader() {
  const { games } = await listGames()

  return { games }
}

/**
 * Creates a new game.
 *
 * @see https://reactrouter.com/start/data/actions for how to edit this.
 * @returns {Promise<{game: Game}>}
 */
export async function action() {
  const { game } = await createGame()

  return { game }
}
