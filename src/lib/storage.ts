import { defaultProfile } from '../data/demo'
import type { Profile, UserJobState } from '../types'

const PROFILE_KEY = 'autumn-radar.profile.v1'
const USER_JOBS_KEY = 'autumn-radar.user-jobs.v1'

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  loadProfile: () => read<Profile>(PROFILE_KEY, defaultProfile),
  saveProfile: (profile: Profile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
  loadUserJobs: () => read<Record<string, UserJobState>>(USER_JOBS_KEY, {}),
  saveUserJobs: (jobs: Record<string, UserJobState>) => localStorage.setItem(USER_JOBS_KEY, JSON.stringify(jobs)),
  reset: () => {
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(USER_JOBS_KEY)
  },
}
