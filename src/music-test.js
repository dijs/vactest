import {serialOpen, serialClose, wait, serialWrite, safeMode, passiveMode, programSong, playSong} from './index'

const B = 71
const E = 71 + 4
const F = 71 + 5
const G = 71 + 7
const Gs = 71 + 8

const quarterNote = 1000 / 4

const song1Notes = [B,E,B,G,B,E,B,G,B,E,B,G,B,E,B,G]
const song2Notes = [B,F,B,Gs,B,F,B,Gs,B,F,B,Gs,B,F,B,Gs]

serialOpen()
  .then(() => wait(1000))
  .then(() => safeMode())
  .then(() => wait(1000))
  .then(() => programSong(0, song1Notes, Array(song1Notes.length).fill(16)))
  .then(() => wait(1000))
  .then(() => programSong(1, song2Notes, Array(song2Notes.length).fill(16)))
  .then(() => wait(1000))
  .then(() => playSong(0))
  .then(() => wait(quarterNote * song1Notes.length + 10))
  .then(() => playSong(1))
  .then(() => wait(quarterNote * song2Notes.length + 10))
  .then(() => passiveMode())
  .then(() => wait(1000))
  .then(() => serialClose())
