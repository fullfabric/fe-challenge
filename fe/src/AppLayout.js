import { Outlet } from 'react-router'

import styles from './AppLayout/styles.module.scss'

export default function AppLayout() {
  return (
    <div className={styles.container}>
      <h1>Dice Game</h1>

      <p>This is a bootstrap react app for implementing a dice game</p>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
