import React, { useState, useEffect } from 'react'

import { games as fetchGames, createGame } from './api'

import styles from './app/styles.module.scss'

export function App() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const loadGames = async () => {
      const { games } = await fetchGames()
      setGames(games)
    }

    loadGames()
  }, [])

  const handleCreateGame = async () => {
    const { game } = await createGame()
    setGames([game, ...games])
  }

  return (
    <div className={styles.container}>
      <h1>Dice Game</h1>
      <p>This is bootstrap react app for implementing a dice game</p>

      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Die Side</th>
              <th>Starting HP</th>
              <th>Created At</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No games yet</td>
              </tr>
            )}
          </tbody>
        </table>

        <button className={styles.createGameButton} onClick={handleCreateGame}>
          Create Game
        </button>
      </div>
    </div>
  )
}
