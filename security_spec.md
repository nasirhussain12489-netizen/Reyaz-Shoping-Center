# Security Specification — Reyaz Shopping Center Fashion E-Commerce Platform

## 1. Data Invariants
1. **Identity & Ownership**: Every document in `/products/{productId}` and `/orders/{orderId}` must have an `ownerId` matching `request.auth.uid` or be written by the verified Super Admin (`nasirhussain12489@gmail.com`).
2. **Strict Key Whitelisting (`hasOnly`)**:
   - `/products/{productId}` only allows keys: `['sku', 'title', 'status', 'primaryCategory', 'subCategory', 'description', 'regularMrp', 'sellingPrice', 'regionalCodEnabled', 'warehouseLocation', 'totalStock', 'ownerId', 'updatedAt']`.
   - `/orders/{orderId}` only allows keys: `['orderNumber', 'customerName', 'village', 'sku', 'productTitle', 'size', 'shade', 'amount', 'status', 'ownerId', 'createdAt']`.
3. **Value & Type Constraints**:
   - `sellingPrice` and `regularMrp` must be numbers between `0` and `500000`.
   - `totalStock` must be an integer between `0` and `100000`.
   - `title`, `sku`, `description` must be bounded strings.
4. **Immutability**:
   - `ownerId` cannot be mutated on `update`.
   - `createdAt` cannot be mutated on `update`.
   - Timestamp fields (`updatedAt`, `createdAt`) must equal `request.time`.
