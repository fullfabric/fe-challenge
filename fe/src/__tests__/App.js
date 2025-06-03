import React from 'react'

import { render, screen } from '@testing-library/react'

import { App } from '../App'

describe('App', () => {
  it('renders a list of games', async () => {
    render(<App />)

    const heading = await screen.findByRole('heading', { name: 'Dice Game' })
    expect(heading).toBeInTheDocument()

    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()

    const rows = await screen.findAllByRole('row')
    expect(rows).toHaveLength(2)

    expect(screen.getByText('15d42a4d-1948-4de4-ba78-b8a893feaf45')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
