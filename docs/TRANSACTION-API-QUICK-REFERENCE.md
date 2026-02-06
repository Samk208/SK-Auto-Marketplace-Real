# Transaction API - Quick Reference

## Endpoints

### 1. List Transactions

```
GET /api/transactions
```

**Query Params**:

- `status` - Filter by status (pending, succeeded, failed, refunded)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (created_at, amount, status, completed_at)
- `order` - Sort order (asc, desc)

**Example**:

```bash
GET /api/transactions?status=succeeded&page=1&limit=20&sort=created_at&order=desc
```

---

### 2. Get Transaction Details

```
GET /api/transactions/[id]
```

**Example**:

```bash
GET /api/transactions/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. Refund Transaction (Admin Only)

```
POST /api/transactions/[id]/refund
```

**Request Body**:

```json
{
  "reason": "Customer requested refund",
  "amount": 250.0 // Optional - for partial refunds
}
```

**Example**:

```bash
POST /api/transactions/550e8400-e29b-41d4-a716-446655440000/refund
Content-Type: application/json

{
  "reason": "Item damaged in shipping",
  "amount": 100.00
}
```

---

## Authorization

| Role   | List Transactions | View Details | Process Refund |
| ------ | ----------------- | ------------ | -------------- |
| Buyer  | Own purchases     | Own          | ❌             |
| Dealer | Own listings      | Own          | ❌             |
| Admin  | All               | All          | ✅             |

---

## Response Status Codes

- `200` - Success
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Transaction not found
- `400` - Bad request (validation error)
- `500` - Server error

---

## Transaction Statuses

- `pending` - Payment initiated
- `processing` - Payment being processed
- `succeeded` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Files

- `app/api/transactions/route.ts` - List endpoint
- `app/api/transactions/[id]/route.ts` - Details endpoint
- `app/api/transactions/[id]/refund/route.ts` - Refund endpoint
- `lib/repositories/audit-logs.ts` - Audit logging helper

---

## Testing with curl

```bash
# List transactions (with auth cookie)
curl -X GET 'http://localhost:3000/api/transactions?status=succeeded' \
  -H 'Cookie: supabase-auth-token=YOUR_TOKEN'

# Get transaction details
curl -X GET 'http://localhost:3000/api/transactions/TRANSACTION_ID' \
  -H 'Cookie: supabase-auth-token=YOUR_TOKEN'

# Process refund (admin only)
curl -X POST 'http://localhost:3000/api/transactions/TRANSACTION_ID/refund' \
  -H 'Cookie: supabase-auth-token=YOUR_ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"reason": "Customer request", "amount": 100.00}'
```

---

## Integration

```typescript
// List transactions with filters
const response = await fetch(
  "/api/transactions?status=succeeded&page=1&limit=10",
);
const { transactions, pagination } = await response.json();

// Get transaction details
const response = await fetch(`/api/transactions/${transactionId}`);
const { transaction } = await response.json();

// Process refund (admin)
const response = await fetch(`/api/transactions/${transactionId}/refund`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    reason: "Customer requested refund",
    amount: 250.0, // Optional
  }),
});
const { success, refund } = await response.json();
```

---

For complete documentation, see: `docs/TRANSACTION-API-IMPLEMENTATION.md`
