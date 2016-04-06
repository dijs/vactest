import {serialOpen, serialClose, wait, serialWrite, safeMode, passiveMode, programSong, playSong} from './index'

const B = 71
const E = 71 + 4
const F = 71 + 5
const G = 71 + 7
const Gs = 71 + 8

const quarterNote = 1000 / 4

const song1Notes = [B,E,B,G,B,E,B,G,B,E,B,G,B,E,B,G]
const song2Notes = [B,F,B,Gs,B,F,B,Gs,B,F,B,Gs,B,F,B,Gs]

const program = [
  serialOpen(),
  safeMode(),
  programSong(0, song1Notes, Array(song1Notes.length).fill(16)),
  programSong(1, song2Notes, Array(song2Notes.length).fill(16)),
  playSong(0),
  wait(quarterNote * song1Notes.length + 10),
  playSong(1),
  wait(quarterNote * song2Notes.length + 10),
  passiveMode(),
  serialClose()
]

program
  .reduce((previous, next) => previous.then(() => next), Promise.resolve())
  .catch(err => console.error(err.stack))
