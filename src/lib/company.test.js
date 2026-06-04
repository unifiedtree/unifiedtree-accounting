import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCompanyRecord, validateCompanyDraft } from './company.js'

test('company draft validation requires a company name and branch', () => {
  const result = validateCompanyDraft({ name: ' ', branch: '', gstin: '' })

  assert.equal(result.valid, false)
  assert.equal(result.errors.name, 'Company name is required')
  assert.equal(result.errors.branch, 'Branch is required')
})

test('company draft validation accepts empty GSTIN but validates supplied GSTIN format', () => {
  assert.equal(validateCompanyDraft({ name: 'Apex', branch: 'HO', gstin: '' }).valid, true)

  const result = validateCompanyDraft({ name: 'Apex', branch: 'HO', gstin: '123' })

  assert.equal(result.valid, false)
  assert.equal(result.errors.gstin, 'GSTIN must be 15 characters')
})

test('company record trims input, uppercases GSTIN, and generates a stable id prefix', () => {
  const company = buildCompanyRecord({
    name: '  Northwind Books LLP  ',
    branch: '  Pune  ',
    gstin: '27aabcu9603r1zx',
    legalType: 'LLP',
  }, 42)

  assert.equal(company.id, 'c42')
  assert.equal(company.name, 'Northwind Books LLP')
  assert.equal(company.branch, 'Pune')
  assert.equal(company.gstin, '27AABCU9603R1ZX')
  assert.equal(company.legalType, 'LLP')
})
