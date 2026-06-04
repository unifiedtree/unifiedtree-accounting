import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { mergeMatrix, can as canFn, levelFor } from '../lib/rbac'

/**
 * Returns a `can(action, sectionId)` checker bound to the current role and
 * any persisted permission overrides. Also exposes role + level helpers.
 */
export function useCan() {
  const currentRole = useAppStore(s => s.currentRole)
  const overrides   = useAppStore(s => s.permissionOverrides)

  const matrix = useMemo(() => mergeMatrix(overrides), [overrides])

  return useMemo(() => Object.assign(
    (action, sectionId) => canFn(matrix, currentRole, sectionId, action),
    {
      role: currentRole,
      level: (sectionId) => levelFor(matrix, currentRole, sectionId),
    }
  ), [matrix, currentRole])
}
