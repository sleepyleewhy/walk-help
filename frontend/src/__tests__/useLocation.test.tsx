/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocation from '@/hooks/sensors/useLocation'

// Minimal mock of Geolocation API for tests
function createMockGeolocation() {
  const mock: any = {
    _success: null as any,
    watchPosition(success: any, _error: any, _opts?: any) {
      mock._success = success
      return 1
    },
    clearWatch(_id: number) {},
  }
  return mock
}

describe('useLocation speed fallback', () => {
  let originalGeo: any
  beforeEach(() => {
    originalGeo = (global as any).navigator?.geolocation
  })
  afterEach(() => {
    // restore
    if (originalGeo) (global as any).navigator.geolocation = originalGeo
    else delete (global as any).navigator
    vi.useRealTimers()
  })

  it('computes fallback speed from GPS delta when coords.speed is null', () => {
    const mockGeo = createMockGeolocation()
    // attach mock
    if (!(global as any).navigator) (global as any).navigator = {}
    ;(global as any).navigator.geolocation = mockGeo

    const { result } = renderHook(() => useLocation(2, false))

    // first position: no previous sample -> speed should be null
    act(() => {
      mockGeo._success({ coords: { latitude: 0, longitude: 0, accuracy: 5, speed: null }, timestamp: 1000 })
    })

    expect(result.current.location.speed).toBeNull()

    // second sample 0.0001 deg north after 1 second -> ~11.1 m / 1s -> speed ~11 m/s
    act(() => {
      mockGeo._success({ coords: { latitude: 0.0001, longitude: 0, accuracy: 5, speed: null }, timestamp: 2000 })
    })

    const sp = result.current.location.speed
    expect(typeof sp).toBe('number')
    expect(sp as number).toBeGreaterThan(1)
  })
})
