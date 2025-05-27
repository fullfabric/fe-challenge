# Dice Game - Full Fabric Frontend Code Challenge

This repo provides the foundation for a Full Fabric Frontend code interview. It includes a fully-functional server with an API for creating, joining, playing and winning a turn-based dice game between two players. It also includes the basic scaffolding for a React-based interface.

We also provide a [Development Containers](https://containers.dev/) definition to make it easier to fork, clone, and start coding immediately.

## The Game

The game is turn-based, strictly between two players. Players take turns attacking or defending against each-other by rolling dice; any damage dealt is decremented from the defending player's HP, until one of them reaches 0, at which point a winner is declared and the game ends.

The rules are as follows:

- A game must have two players.
- Each player starts with the same HP, which defaults to 20.
- A game is played with a single N-sided die, which defaults to 6 sides.
- The game starts by selecting the attacker and defender at random.
- Each turn, each player rolls the die once.
- The rolls determine the attack and defense values, depending on the player's role that turn.
- If the attack value is greater than the defense value, the defending player takes damage equal to the difference between the two values.
- After damage is dealt, and if all players are still alive (HP > 0) their roles are switched.
- The players continue taking turns attacking and defending until one of them dies and is declared the winner.

## The Challenge

During the interview you will be leading a pair-programming-like session where you will design and implement a visual interface for the game in React. You are expected to use the REST API implemented in this repo to manage the game's state, leaving you responsible only for presentational decisions.

The API is described [here](https://fullfabric.github.io/fe-challenge/), or by accessing `/docs` on your development server. An OpenAPI file is also available by accessing `/openapi.yaml`.

The UI you design should allow for:

- Creating a game with optionally custom player HP and die sides.
- Listing available games.
- Joining a non-full game.
- Taking a turn (rolling the die).
- Showing the current state of the game and each player's.
- Displaying the winner if one has been found.

You're not expected to come up with an extremely stylish UI (though you may build one if that's your wish) but you should concern yourself with basic design principles (whitespace, alignment, etc.) and the user's experience.

## Getting Started

### CodeSpaces

The easiest way to start working on this challenge is to run it on a GitHub Codespace. This will automatically set up everything you need to run the development server, and start it when you attach a session. Browser reloading and code change watching will be set up for you.

Note: due to platform limitations, the Port Visibility for the process on port 8081 must be set to Public.

### Locally

If you prefer to run this locally, you can:

1. Clone the repo
2. Install npm@20 and yarn
3. `yarn install`
4. `yarn start`
5. Open a browser on http://localhost:8080

## Writing Code

The frontend code is under `fe/src`; the entry point for the app is in `fe/src/App.js`. You can explore the API code under `be` if you wish.

During the interview you may install any packages, such as React libs, design systems, etc. that you wish.
