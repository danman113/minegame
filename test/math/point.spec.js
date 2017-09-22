import { pt } from '../../src/math'
import {expect} from 'chai'

describe('Point', function () {
  it('pt() works as expected', function () {
    const p1 = pt(10, 2)
    expect(p1.y).to.be.equal(2)
    expect(p1.x).to.be.equal(10)
  })
})
