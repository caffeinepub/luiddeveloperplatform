# LuidDeveloperPlatform

## Current State
The platform has a React frontend managing all data (users, products, orders, licenses) in-memory React state only. The backend Motoko canister has a single `initialize()` function that seeds data but has no CRUD operations. As a result, data is lost on page refresh, does not persist between devices, and the admin panel never reflects real data.

## Requested Changes (Diff)

### Add
- Backend: full CRUD functions for users, products, orders, licenses persisted in stable storage
- Backend: `login(username, passwordHash)` query returning user or error
- Backend: `register(username, email, passwordHash)` returning new user or error
- Backend: `getUsers()`, `getUser(id)`, `updateUser(...)`, `deleteUser(id)`
- Backend: `getProducts()`, `getProduct(id)`, `addProduct(...)`, `updateProduct(...)`, `deleteProduct(id)`, `toggleProductActive(id)`
- Backend: `getOrders()`, `getOrdersByUser(userId)`, `createOrder(...)`
- Backend: `getLicenses()`, `getLicensesByUser(userId)`, `createLicense(...)`
- Backend: `resetOrders()` — clears all orders/licenses and purchasedProductIds
- Frontend: replace all in-memory state operations with backend actor calls
- Frontend: `useAppStore` becomes async — loads data from canister on mount, calls canister on every mutation

### Modify
- Backend `initialize()` — seeds admin user with correct password hash matching frontend `simpleHash` logic, seeds 10 products
- Frontend `useAppStore` — convert login, register, addProduct, updateProduct, deleteProduct, purchaseProduct, toggleProductActive, toggleUserActive, deleteUser, resetOrders to async canister calls
- Frontend polling — replace no-op polling with real `getProducts()`/`getUsers()` calls every 8 seconds

### Remove
- Frontend in-memory seed data (SEED_ADMIN, SEED_PRODUCTS constants) — data comes from canister
- No-op polling interval that only had a comment

## Implementation Plan
1. Generate new Motoko backend with complete stable-storage CRUD
2. Update `useAppStore.ts` to wire all operations through backend actor
3. Add loading states for async operations in UI
4. Validate and build
