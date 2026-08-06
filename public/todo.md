# TODO - Rebuild Admin UI Using Existing Cloudflare API

## Objective

Rebuild the admin page using the visual design from `lapak-jajan-bintaro.html` while preserving all existing business logic from `admin.html`.

This is NOT a refactor.

This is NOT an edit of the existing bundled file.

This is a complete UI rebuild using the existing API.

---

# IMPORTANT RULES

## DO NOT

❌ Modify the bundled JavaScript inside `admin.html`

❌ Replace or edit the React runtime

❌ Search & replace large sections

❌ Rewrite minified code

❌ Touch Cloudflare API endpoints

❌ Change database schema

❌ Change authentication flow

❌ Change request payload

❌ Change response format

---

## DO

✅ Create completely new UI components

✅ Use `lapak-jajan-bintaro.html` ONLY as visual reference

✅ Copy ONLY business logic

✅ Keep every API endpoint exactly the same

✅ Keep database compatibility

✅ Build small components one by one

---

# Source Files

Visual Reference

lapak-jajan-bintaro.html

Purpose:
Only for layout, colors, spacing, typography and UX.

DO NOT copy JavaScript from this file.

---------------------------------------

Business Logic

admin.html

Purpose:
Extract only:

- authentication
- fetch data
- create
- update
- delete
- upload image
- pagination
- search
- API helper
- Cloudflare integration

Do NOT copy UI.

---

# Target Architecture

admin-v2/

```
admin-v2/
│
├── index.html
├── css/
│      style.css
│
├── js/
│      api.js
│      auth.js
│      products.js
│      ui.js
│      modal.js
│      upload.js
│
└── assets/
```

Or if React is available:

```
src/

components/

pages/

services/

hooks/

utils/
```

---

# Development Strategy

Never attempt to finish everything in one generation.

Complete one milestone.

Verify.

Continue.

---

# Milestone 1

Create layout only.

No API.

Checklist

- Sidebar
- Header
- Dashboard Layout
- Product List Container
- Search Box
- Filter
- Modal
- Buttons

Everything should visually match
lapak-jajan-bintaro.html.

STOP.

Verify.

Commit.

---

# Milestone 2

Integrate Authentication

Reuse login logic from admin.html.

Do not modify endpoint.

Verify login still works.

STOP.

Commit.

---

# Milestone 3

Load Product List

Reuse

fetchProducts()

Do not change endpoint.

Render inside new layout.

Verify.

Commit.

---

# Milestone 4

Search

Reuse existing search logic.

Do not rewrite API.

Verify.

Commit.

---

# Milestone 5

Pagination

Reuse existing pagination logic.

Verify.

Commit.

---

# Milestone 6

Create Product

Reuse POST request.

Reuse payload.

Reuse validation.

Only replace UI.

Verify.

Commit.

---

# Milestone 7

Update Product

Reuse PUT request.

Reuse payload.

Replace only form layout.

Verify.

Commit.

---

# Milestone 8

Delete Product

Reuse DELETE endpoint.

Verify.

Commit.

---

# Milestone 9

Image Upload

Reuse upload endpoint.

Reuse Cloudflare image logic.

Do not change storage configuration.

Verify.

Commit.

---

# Milestone 10

Polish

Responsive

Loading State

Toast

Empty State

Error State

Dark Mode (optional)

---

# API Rules

Never invent endpoints.

Never rename endpoint.

Never modify payload.

Never modify response.

If endpoint is unclear:

STOP.

Search inside admin.html.

Extract only required function.

Continue.

---

# UI Rules

The UI must look visually identical to:

lapak-jajan-bintaro.html

Matching:

- spacing
- colors
- typography
- border radius
- shadows
- card layout
- buttons
- icons
- responsive behavior

Do not copy bundled JS.

Only reproduce appearance.

---

# Refactoring Rules

Large files must be split.

No file should exceed 400 lines whenever possible.

Separate

API

UI

Modal

State

Utilities

Upload

---

# Context Rules

Never load the entire admin.html into memory.

Only inspect the function currently needed.

Example:

Need upload?

Search upload function only.

Need pagination?

Search pagination only.

Need delete?

Search delete only.

Never process the entire bundled file.

---

# Git Workflow

After every completed milestone

Commit.

Example

git commit -m "Milestone 3 - Product List"

Never continue after large changes without commit.

---

# Success Criteria

✔ Existing Cloudflare API still works

✔ Existing database unchanged

✔ Existing authentication unchanged

✔ Existing CRUD unchanged

✔ Existing upload unchanged

✔ UI matches lapak-jajan-bintaro.html

✔ Code is modular

✔ Easy to maintain

✔ No bundled code edited