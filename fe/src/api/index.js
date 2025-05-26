export async function games() {
  const response = await fetch('http://localhost:8080/games')
  return await response.json()
}

export async function createGame() {
  const response = await fetch('http://localhost:8080/games', {
    method: 'POST'
  })

  return await response.json()
}
