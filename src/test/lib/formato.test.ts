import { describe, expect, it } from 'vitest'
import { formatearPrecioCOP } from '../../lib/formato'

describe('formato', () => {
  it('formatea 250000 como pesos colombianos', () => {
    expect(formatearPrecioCOP(250000)).toMatch(/^\$\s?250\.000$/)
  })
})
