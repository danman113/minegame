import {pt, Polygon} from './math'
import {drawPolygon} from './renderer/draw'

let c = document.getElementById('canvas').getContext('2d')

let shape = new Polygon(pt(0,0), pt(0,30), pt(30,30))

console.log(`The main point`, pt(3,4))

console.log(`Shape of everything`, shape)

drawPolygon(c, shape)