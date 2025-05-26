export async function games() {
  const response = await fetch('/games')
  return await response.json()
}

export async function createGame() {
  const response = await fetch('/games', {
    method: 'POST'
  })

  return await response.json()
}
