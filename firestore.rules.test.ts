/**
 * Firestore Security Rules Test Specification (Dirty Dozen Verification)
 */
export const DIRTY_DOZEN_TESTS = [
  { id: 1, name: 'Reject unauthenticated product creation', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Reject unverified admin email spoof', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Reject mismatched ownerId on create', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Reject shadow field injection on create', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Reject shadow field injection on update', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Reject ownerId mutation on update', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Reject oversized description string (>1000 chars)', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Reject invalid primaryCategory enum value', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Reject negative sellingPrice or regularMrp', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Reject poisoned document IDs', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Reject unauthorized cross-user list query', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Reject string value in numeric totalUnits field', expected: 'PERMISSION_DENIED' },
];
