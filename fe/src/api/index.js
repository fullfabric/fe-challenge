export async function listGames() {
  const response = await fetch('/api/games')
  return await response.json()
}

export async function createGame(body = {}) {
  const response = await fetch('/api/games', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  })

  return await response.json()
}

export async function getGame(gameId) {
  const response = await fetch(`/api/games/${gameId}`)
  return await response.json()
}

export async function joinGame(gameId, playerName) {
  const response = await fetch(`/api/games/${gameId}/join`, {
    method: 'POST',
    body: JSON.stringify({ playerName }),
    headers: { 'Content-Type': 'application/json' }
  })

  return await response.json()
}

export async function startGame(gameId) {
  const response = await fetch(`/api/games/${gameId}/start`, {
    method: 'POST'
  })

  return await response.json()
}

export async function roll(gameId) {
  const response = await fetch(`/api/games/${gameId}/roll`, {
    method: 'POST'
  })

  return await response.json()
}
