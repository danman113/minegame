import { Line, pt, slope } from '../../src/math'
import { expect } from 'chai'

const roundPoint = ({x, y}) => {
  return pt(Math.round(x), Math.round(y))
}

describe('Line', function () {
  it('line works as expected', function () {
    const ln = new Line(pt(0,1), pt(2,3))
    expect(ln.p0.x).to.be.equal(0)
    expect(ln.p0.y).to.be.equal(1)
    expect(ln.p1.x).to.be.equal(2)
    expect(ln.p1.y).to.be.equal(3)
  })

  it('slope calculates correctly', function () {
    expect(slope(pt(0,0), pt(10,0))).to.be.equal(0)
    expect(slope(pt(0,0), pt(20,20))).to.be.equal(1)
    expect(slope(pt(30,30), pt(10,50))).to.be.equal(-1)
  })

  it('line -> line intersection works correctly', function () {
    const ln1 = new Line(pt(0,0), pt(10,0))
    const ln2 = new Line(pt(10,0), pt(10,10))
    expect(ln1.intersectsLine(ln2)).deep.equal(pt(10, 0))
  })

  it('line -> segment intersection works correctly for hits', function () {
    const ln1 = new Line(pt(0, 0), pt(10, 0))
    const ln2 = new Line(pt(0, 10), pt(1, 10))
    const ln3 = new Line(pt(10, -100), pt(10, -99))
    const ln4 = new Line(pt(10, 100), pt(10, -100))
    const ln5 = new Line(pt(15, -100), pt(15, -99))
    const ln6 = new Line(pt(15, 100), pt(15, 99))
    const ln7 = new Line(pt(12.5, 0), pt(12.5, 1))
    const ln8 = new Line(pt(12.5, 100), pt(12.5, 99))
    const ln9 = new Line(pt(0, 5), pt(1, 5))
    const ln10 = new Line(pt(100, 5), pt(99, 5))
    const seg = new Line(pt(10, 0), pt(15, 10))

    // Top from left
    expect(ln1.intersectsSegment(seg)).deep.equal(pt(10, 0))
    // Bottom from left
    expect(ln2.intersectsSegment(seg)).deep.equal(pt(15, 10))
    // Top from Top
    expect(ln3.intersectsSegment(seg)).deep.equal(pt(10, -0))
    // Top from bottom
    expect(ln4.intersectsSegment(seg)).deep.equal(pt(10, 0))
    // Bottom from top
    expect(ln5.intersectsSegment(seg)).deep.equal(pt(15, 10))
    // Bottom from bottom
    expect(ln6.intersectsSegment(seg)).deep.equal(pt(15, 10))
    // Middle from top
    expect(ln7.intersectsSegment(seg)).deep.equal(pt(12.5, 5))
    // Middle from bottom
    expect(ln8.intersectsSegment(seg)).deep.equal(pt(12.5, 5))
    // Middle from left
    expect(ln9.intersectsSegment(seg)).deep.equal(pt(12.5, 5))
    // Middle from right
    expect(ln10.intersectsSegment(seg)).deep.equal(pt(12.5, 5))
  })

  it('line -> segment intersection works correctly for missing', function () {
    const ln1 = new Line(pt(9, 0), pt(9, 1))
    const ln2 = new Line(pt(16, 0), pt(16, 1))
    const ln3 = new Line(pt(0, -1), pt(1, -1))
    const ln4 = new Line(pt(0, 16), pt(1, 16))
    const seg = new Line(pt(10, 0), pt(15, 10))

    // Top from left
    expect(ln1.intersectsSegment(seg)).to.be.equal(null)
    // Bottom from left
    expect(ln2.intersectsSegment(seg)).to.be.equal(null)
    // Top from Top
    expect(ln3.intersectsSegment(seg)).to.be.equal(null)
    // Top from bottom
    expect(ln4.intersectsSegment(seg)).to.be.equal(null)
  })

  it('line rotation works correctly', function () {
    const ln = new Line(pt(0, 0), pt(1, 0))
    ln.rotate(Math.PI/2)
    expect(roundPoint(ln.p1)).deep.equal(pt(0, 1))
    
    ln.rotate(Math.PI/2)
    expect(roundPoint(ln.p1)).deep.equal(pt(-1, 0))
    
    ln.rotate(Math.PI/2)
    expect(roundPoint(ln.p1)).deep.equal(pt(-0, -1))
    
    ln.rotate(Math.PI/2)
    expect(roundPoint(ln.p1)).deep.equal(pt(1, -0))
    
  })
})
