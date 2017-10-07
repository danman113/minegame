import { Line, pt, slope } from '../../src/math'
import { expect } from 'chai'

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
  
  it('line intersection works correctly', function () {
    const ln1 = new Line(pt(0,0), pt(10,0))
    const ln2 = new Line(pt(10,0), pt(10,10))
    expect(ln1.intersectsLine(ln2)).deep.equal(pt(10, 0))
  })
})
