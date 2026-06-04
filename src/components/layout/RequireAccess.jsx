import { Navigate } from 'react-router-dom'
import { useCan } from '../../hooks/useCan'

/**
 * Route guard — redirects to the dashboard if the current role cannot view
 * the given section. Frontend gating only (not a security boundary).
 */
export default function RequireAccess({ sectionId, children }) {
  const can = useCan()
  if (!can('view', sectionId)) return <Navigate to="/dashboard/overview" replace />
  return children
}
