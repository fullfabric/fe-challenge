import { Outlet } from 'react-router'

import styles from './AppLayout/styles.module.scss'

export default function AppLayout() {
  return (
    <div className={styles.container}>
      <div className='bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow'>
        <h1>Dice Game</h1>

        <p>This is a bootstrap react app for implementing a dice game</p>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
