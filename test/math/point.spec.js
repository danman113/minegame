import { pt, distance, angle3, degToRad } from '../../src/math'
import {expect} from 'chai'

describe('Point', function () {
  it('pt() works as expected', function () {
    const p1 = pt(10, 2)
    expect(p1.y).to.be.equal(2)
    expect(p1.x).to.be.equal(10)
  })

  it('Distance between points are correct', function () {
    let p1 = pt(0, 0)
    let p2 = pt(20, 0)
    expect(distance(p1, p2)).to.be.equal(20)
    expect(distance(p2, p1)).to.be.equal(20)
    p1 = pt(0, 0)
    p2 = pt(20, 20)
    expect(Math.round(distance(p1, p2))).to.be.equal(28)
    expect(Math.round(distance(p2, p1))).to.be.equal(28)
  })

  it('Angle between points are correct for cw points', function () {
    // Test for cw
    let p1 = pt(0, 0)
    let p2 = pt(0, 20)
    let p3 = pt(20, 20)
    expect(angle3(p1, p2, p3)).to.be.equal(degToRad(90) * -1)

    p1 = pt(20, 0)
    p2 = pt(20, 20)
    p3 = pt(0, 20)
    expect(angle3(p1, p2, p3)).to.be.equal(degToRad(270) * -1)
  })

  it('Angle between points are correct for ccw points', function() {
    // Test for ccw
    let p1 = pt(0, 0)
    let p2 = pt(0, 20)
    let p3 = pt(20, 20)
    expect(angle3(p3, p2, p1)).to.be.equal(degToRad(90))

    p1 = pt(20, 0)
    p2 = pt(20, 20)
    p3 = pt(0, 20)
    expect(angle3(p3, p2, p1)).to.be.equal(degToRad(270))
  })
})
