import { pt, Polygon, distance, ccw } from './math'
import { drawPolygon } from './renderer/draw'

let c = document.getElementById('canvas').getContext('2d')

let shape = new Polygon(pt(0,0), pt(0,30), pt(30,30))

console.log(`The main point`, pt(3,4))

console.log(`Shape of everything`, shape)

drawPolygon(c, shape)


console.log( Array(10).join('*') + 'tri' + Array(10).join('*'))

console.log(shape.perimeter(), shape.area(), ccw(shape.verticies[0],shape.verticies[1],shape.verticies[2]), shape.convex())


console.log( Array(10).join('*') + 'square' + Array(10).join('*'))

let square = new Polygon(pt(0,0), pt(30,0), pt(30,30), pt(0,30))

console.log(square.perimeter())

console.log(square.area())

square.translate(100,100)

drawPolygon(c, square)


console.log( Array(10).join('*') + 'ngon' + Array(10).join('*'))

let ngon = new Polygon(pt(100, 120), pt(200, 60), pt(280, 200), pt(200, 260), pt(200, 180))

console.log(ngon.perimeter(), ngon.area(), ngon.convex())
drawPolygon(c, ngon)    

console.log( Array(10).join('*') + 'rectangle' + Array(10).join('*'))
let rectange = new Polygon(pt(120, 180), pt(260, 180), pt(260, 240), pt(120, 240))

console.log(rectange.area())

drawPolygon(c, rectange)