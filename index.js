const prompt = require('prompt-sync')({ sigint: true });
const _ = require('lodash');


const curry = (fn, ...values) => {
  return (...next) => (next.length) ? curry(fn, ...values, ...next) : fn(...values);
}

const initGame = (...names) => {
  const maxPoints = 501;
  return names.reduce((acc, cur) => ({...acc, [cur]: maxPoints}), {})
}

const currifiedInitGame = curry(initGame)

const inputPlay = (points) => {
  return (moves) => {
    const newPoints = moves.reduce((acc, cur) => acc -= cur === "DB" ? 50 : (cur === "SB" ? 25 : cur[0] * cur[1]), points)
    return Math.abs(newPoints)
  }
}

const playGame = (players) => {
  const names = Object.keys(players)

  console.log(`Juego inicializado con los jugadores ${names.slice(0, -1).reduce((acc, cur) => acc += `${cur}, `, '').slice(0, -2)}${names.length > 1 ? ' y ' : ''}${names.slice(-1)}`)

  while (winners(players).length === 0) {
    names.forEach(actualPlayer => {
      console.log(`Ingrese lanzamiento de ${actualPlayer}`)
      const play = JSON.parse(_.replace(prompt(''), /'/g,'"'))
      players[actualPlayer] = inputPlay(players[actualPlayer])(play)
      console.log(`La nueva puntuación de ${actualPlayer} es ${players[actualPlayer]}`)
    })
  }

  console.log("Juego terminado!")
  console.log(`Ha ganado: ${winners(players).slice(0, -1).reduce((acc, cur) => acc += `${cur[0]}, `, '').slice(0, -2)}${winners(players).length > 1 ? ' y ' : ''}${winners(players).slice(-1)[0][0]}`)

const winners = (players) => {
  return Object.entries(players).filter(cur => cur[1] === 0)
}

console.log('Ingrese los jugadores separados por coma:')
const nameList = _.words(prompt('')).map(cur => _.capitalize(cur))

playGame(nameList.reduce((acc, cur) => acc(cur), currifiedInitGame)())
