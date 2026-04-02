# Admin Vehicle Management — Design Spec
**Date:** 2026-04-02

## Overview

Allow admins to add new cars, edit existing car info (including prices), and upload photos so clients can see the actual vehicles they are renting. All changes are made through the existing admin inventory page at `/admin/inventory`.

---

## Components

### `VehicleFormModal` (`src/components/vehicles/VehicleFormModal.tsx`)

A single shared modal component that handles both adding and editing vehicles.

**Props:**
- `vehicle?: Vehicle` — if provided, modal opens in edit mode with pre-filled fields; if absent, opens in add mode with blank fields
- `onSuccess: () => void` — called after a successful save so the parent can re-fetch the vehicle list
- `open: boolean`
- `onOpenChange: (open: boolean) => void`

**Uses:** existing `Dialog` component from `src/components/ui/dialog.tsx`

**Form sections (single scrollable form):**

| Section | Fields |
|---|---|
| Basic Info | Make, Model, Year, Type (sedan/suv/minivan/truck/compact), Slug, Description |
| Pricing | Weekly Price (dollars → stored as cents), Deposit Amount (dollars → stored as cents) |
| Specs | Transmission, Fuel Type, Seats, MPG City, MPG Highway, Mileage Policy, Min Rental Days, Features (comma-separated) |
| Eligibility | Uber Eligible, Lyft Eligible, Delivery Eligible, Featured (boolean toggles) |
| Photos | Image uploader (see below) |

**On save:**
- Add mode → `POST /api/vehicles`
- Edit mode → `PATCH /api/vehicles/[id]`
- Prices entered as dollars (e.g. 150) are multiplied by 100 before sending to the API (stored as cents)
- On success: call `onSuccess()` and close modal
- On error: display inline error message

---

### Image Uploader (inline within `VehicleFormModal`)

A self-contained sub-section at the bottom of the form.

**Behavior:**
- Drag-and-drop zone and click-to-browse file picker, supports selecting multiple files at once
- Accepted types: `image/jpeg`, `image/png`, `image/webp`
- On file selection: immediately `POST` each file to `/api/admin/upload-image` as `multipart/form-data`
- While uploading: show a loading spinner thumbnail placeholder
- On success: show thumbnail with a remove (×) button
- On remove: remove URL from local `images` array (does not delete the file from disk)
- Edit mode: existing image URLs from the vehicle record are pre-loaded as thumbnails and can be removed

The `images` string array is included in the final form payload sent to `/api/vehicles` on save.

---

## API

### New: `POST /api/admin/upload-image`

- **Auth:** `requireAdmin`
- **Request:** `multipart/form-data` with field `file` (single image)
- **Behavior:** writes file to `public/uploads/[timestamp]-[sanitized-originalname]`
- **Response:** `{ url: "/uploads/[filename]" }`
- Next.js serves `public/` as static files, so images are immediately accessible

**Cloud migration path:** When deploying, only this route changes. Swap the filesystem write for a Supabase Storage or Cloudinary SDK upload call and return their CDN URL. All other code stores and renders a URL string — nothing else changes.

### Existing (unchanged):

| Route | Use |
|---|---|
| `POST /api/vehicles` | Create new vehicle — already exists, already admin-protected |
| `PATCH /api/vehicles/[id]` | Update vehicle fields including `images` array — already exists, already admin-protected |

---

## Inventory Page Changes (`src/app/admin/inventory/page.tsx`)

1. Replace the placeholder modal (`showAddForm` state + hardcoded "Use the API" message) with `<VehicleFormModal open={showAddForm} onOpenChange={setShowAddForm} onSuccess={refetch} />`
2. Add a pencil (Edit) icon button to each table row. Clicking sets `editingVehicle` state and opens `<VehicleFormModal vehicle={editingVehicle} ... />`
3. After `onSuccess`, re-fetch vehicles from `/api/vehicles` to reflect changes in the table

---

## File Changes Summary

| File | Change |
|---|---|
| `src/components/vehicles/VehicleFormModal.tsx` | New — shared add/edit modal |
| `src/app/api/admin/upload-image/route.ts` | New — image upload to `public/uploads/` |
| `src/app/admin/inventory/page.tsx` | Updated — wire in modal, add Edit buttons |
| `public/uploads/` | New directory — created at runtime on first upload |

---

## Out of Scope

- Image reordering (drag to reorder) — can be added later
- Image compression/resizing — can be added later
- Deleting a vehicle — the `DELETE /api/vehicles/[id]` endpoint already exists; a delete button can be added to the modal later
- Bulk import of vehicles
