import { describe, expect, it } from 'vitest'
import { demoJobs, defaultProfile } from '../data/demo'
import { calculateMatch, isExcluded } from './matching'

describe('calculateMatch', () => {
  it('returns a bounded explainable score', () => {
    const result = calculateMatch(demoJobs[0], defaultProfile)
    expect(result.score).toBeGreaterThanOrEqual(80)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.reasons.length).toBeLessThanOrEqual(3)
    expect(result.gaps.length).toBeLessThanOrEqual(2)
  })

  it('recognises aliases and excludes closed jobs', () => {
    expect(calculateMatch(demoJobs[1], defaultProfile).dimensions.role).toBe(30)
    expect(isExcluded(demoJobs[11], defaultProfile)).toBe(true)
  })
})
