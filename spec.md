# LuidDeveloperPlatform

## Current State

Full-stack SaaS marketplace (LuidCorporation) for bots, scripts and automation tools. The frontend is a React/TypeScript SPA with:
- Landing page, marketplace, product detail, login, register, dashboard, admin panel, Luid AI placeholder
- All data (users, products, orders, licenses) persisted **exclusively via localStorage/sessionStorage** in `useAppStore.ts`
- No real backend data layer -- the Motoko backend only has blob-storage mixin, no domain data
- No cross-device sync; each browser has its own isolated state
- File uploads stored in localStorage keys (`ldp_file_<id>`)

## Requested Changes (Diff)

### Add
- Full Motoko backend with persistent stable storage for: Users, Products, Orders, Licenses, VersionHistory
- Admin seed user (SidneiCosta00 / Nikebolado@4) initialized on first call
- Seed products (10 items across 4 categories) initialized on first call
- All CRUD operations as public backend functions: login, register, getProducts, addProduct, updateProduct, deleteProduct, toggleProductActive, purchaseProduct, getOrders, getLicenses, getUsers, toggleUserActive, deleteUser, resetOrders, updateUserEmail, appendVersionHistory
- Password hashing in backend (SHA-256 equivalent via simple hash stored as Text)
- File metadata stored in backend; file blobs via existing blob-storage component
- Real-time polling mechanism: frontend polls backend every 3-5 seconds for products/orders/licenses updates and merges state reactively
- Session stored in memory (React state) only -- no localStorage for session

### Modify
- `useAppStore.ts`: rewrite entirely -- remove all localStorage/sessionStorage references, replace with async calls to backend canister; add polling loop for real-time sync
- All pages that call store functions: adapt to async store (loading states, error handling)
- File deletion: call backend to remove file record on product delete
- Admin page: all mutations go through backend calls

### Remove
- All `localStorage.getItem/setItem/removeItem` calls
- All `sessionStorage` usage
- `loadFromStorage`, `saveToStorage`, `initializeIfNeeded`, `KEYS` constants
- Singleton `_state` pattern (replaced by backend as source of truth)
- Any `ldp_file_*` localStorage file storage (files use blob-storage canister)

## Implementation Plan

1. Generate Motoko backend with stable storage for all domain entities, all CRUD endpoints, seed data initialization, and blob-storage integration for file handling.
2. Rewrite `useAppStore.ts` to be async -- call backend actor for every read/write, poll every 4 seconds for reactive updates, store only session (currentUser) in React memory.
3. Update all pages to handle async store: add loading spinners, disable buttons during operations, show error messages.
4. Remove every localStorage/sessionStorage reference from the entire codebase.
5. Validate with typecheck and build.
