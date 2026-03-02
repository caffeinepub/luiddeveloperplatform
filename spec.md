# LuidDeveloperPlatform

## Current State
- Full-stack marketplace SaaS with landing page, marketplace, admin panel, user dashboard.
- Products stored in localStorage with fields: id, name, description, version, category, priceOneTime, priceSubscription, fileId?, fileName?, isActive, createdAt, rating, reviewCount, tags.
- Admin can add/edit/delete/toggle products via a modal form (no file upload).
- Users can purchase products and view licenses/orders in dashboard (no download functionality).
- No product update changelog/versioning history exists.
- blob-storage component is already selected (caffeine.lock.json).

## Requested Changes (Diff)

### Add
- **File upload in Admin product form**: When adding or editing a product, admin can upload a script/file. File is stored in localStorage as a base64 blob keyed by product ID. Fields: `fileId` (string key in localStorage), `fileName` (original file name), `fileSize` (bytes).
- **Download button in User Dashboard**: In "Minhas Compras" tab, each purchased product that has an associated file shows a "Baixar" (Download) button. Clicking it triggers a browser file download using the stored base64 blob.
- **File deletion on product removal**: When admin deletes a product, its associated file blob is also removed from localStorage.
- **"Atualizado" badge / version changelog**: Product model gains an `updatedAt?: number` and `updateNote?: string` field. Admin can, when editing a product, check a toggle "Marcar como atualizado" and optionally fill a short update note. When `updatedAt` is set, a badge "Atualizado" (green) appears on the product card in the marketplace and on the product detail page, and on the dashboard purchase/license card. Admin can also clear the update note. In the admin products table, show a small "Atualizado" indicator next to the version.

### Modify
- `Product` type: add `fileId?: string`, `fileName?: string`, `fileSize?: number`, `updatedAt?: number`, `updateNote?: string`.
- `addProduct` and `updateProduct` in store: handle saving/clearing file data.
- `deleteProduct` in store: also remove the file blob from localStorage.
- `ProductFormData` in AdminPage: add file state and update note state.
- Admin product form modal: add file upload section and update note section.
- Admin products table: show file icon if file attached, show "Atualizado" badge if updatedAt set.
- Dashboard "Minhas Compras": add download button per order if product has a file.
- Dashboard "Minhas Licenças": show "Atualizado" badge if product has been updated.
- MarketplacePage / ProductDetailPage: show "Atualizado" badge on products with updatedAt.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend `Product` type with `fileId`, `fileName`, `fileSize`, `updatedAt`, `updateNote`.
2. Extend store: 
   - `addProduct` accepts optional file fields.
   - `updateProduct` handles file fields and update timestamp.
   - `deleteProduct` removes `ldp_file_<id>` from localStorage.
3. Update `AdminPage`:
   - Add file state (`uploadedFile: File | null`, `uploadedFileId: string | null`, `uploadedFileName: string`, `uploadedFileSize: number`) to form state.
   - Add update note state (`markAsUpdated: boolean`, `updateNote: string`).
   - Add file upload UI (drag/click area + clear button) inside the product form modal.
   - Add "Marcar como atualizado" toggle + update note input when editing.
   - On form submit: encode file to base64, save to `localStorage` under key `ldp_file_<productId>`, persist `fileId`/`fileName`/`fileSize` on product. On product delete: call `localStorage.removeItem("ldp_file_<id>")`.
   - Show file icon / "Atualizado" badge in table rows.
4. Update `DashboardPage`:
   - In "Minhas Compras": add "Baixar" button for orders where product has `fileName`. On click: retrieve base64 from localStorage, create a Blob, trigger download.
   - In "Minhas Licenças": show "Atualizado" badge + updateNote if product has `updatedAt`.
5. Update `MarketplacePage` product cards and `ProductDetailPage`: show "Atualizado" badge with note tooltip if `updatedAt` set.
