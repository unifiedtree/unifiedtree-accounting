const GSTIN_LENGTH = 15

export function validateCompanyDraft(draft) {
  const errors = {}
  const name = draft.name?.trim()
  const branch = draft.branch?.trim()
  const gstin = draft.gstin?.trim()

  if (!name) errors.name = 'Company name is required'
  if (!branch) errors.branch = 'Branch is required'
  if (gstin && gstin.length !== GSTIN_LENGTH) {
    errors.gstin = `GSTIN must be ${GSTIN_LENGTH} characters`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function buildCompanyRecord(draft, sequence = Date.now()) {
  return {
    id: `c${sequence}`,
    name: draft.name?.trim() ?? '',
    gstin: draft.gstin?.trim().toUpperCase() ?? '',
    branch: draft.branch?.trim() ?? '',
    legalType: draft.legalType || 'Private Limited',
    departments: draft.departments
      ? draft.departments.split(',').map(item => item.trim()).filter(Boolean)
      : ['Accounts'],
    zones: draft.zones
      ? draft.zones.split(',').map(item => item.trim()).filter(Boolean)
      : ['Maharashtra'],
  }
}
