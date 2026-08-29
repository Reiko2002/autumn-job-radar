import { describe, expect, it } from 'vitest'
import { validateJobsPayload } from './jobRepository'

describe('validateJobsPayload', () => {
  it('rejects unsupported payloads', () => expect(() => validateJobsPayload({ schemaVersion: 2, jobs: [] })).toThrow())
  it('accepts a valid empty payload', () => expect(validateJobsPayload({ schemaVersion: 1, generatedAt: '2026-08-29T00:00:00Z', stats: { total: 0, active: 0, suspectedClosed: 0, closed: 0, sourcesSucceeded: 1, sourcesFailed: 0 }, jobs: [] }).jobs).toEqual([]))
})
