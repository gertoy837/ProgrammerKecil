## Product Upload Endpoint Documentation

### Overview
Product upload endpoints sudah terintegrasi dengan multer untuk menangani `multipart/form-data`. File disimpan di `backend/uploads/products/` dan path file disimpan ke database.

---

## Endpoints

### 1. Create Product with Image (POST /products)
**Endpoint:** `POST /api/products`

**Authentication:** Admin only (Bearer token required)

**Content-Type:** `multipart/form-data`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | ✅ Yes | Product image (JPG, PNG, GIF, max 5MB) |
| `name` | String | ✅ Yes | Product name |
| `price` | Number | ✅ Yes | Product price |
| `stock` | Number | ✅ Yes | Product stock |
| `description` | String | ✅ Yes | Product description |
| `categoryId` | Number | ✅ Yes | Category ID |

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "name=Gaming Mouse" \
  -F "price=500000" \
  -F "stock=15" \
  -F "description=Professional gaming mouse" \
  -F "categoryId=1"
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Produk berhasil dibuat",
  "productId": 5,
  "fileInfo": {
    "filename": "1714398001234-5678.jpg",
    "size": 245678,
    "path": "backend/uploads/products/1714398001234-5678.jpg"
  }
}
```

**Error Response (400):**
```json
{
  "status": false,
  "message": "File gambar harus disertakan saat membuat produk",
  "code": "NO_IMAGE_PROVIDED"
}
```

---

### 2. Update Product with Optional Image (PUT /products/:id)
**Endpoint:** `PUT /api/products/:id`

**Authentication:** Admin only (Bearer token required)

**Content-Type:** `multipart/form-data` (optional image)

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | ❌ No | Product image (JPG, PNG, GIF, max 5MB) |
| `name` | String | ❌ No | Product name |
| `price` | Number | ❌ No | Product price |
| `stock` | Number | ❌ No | Product stock |
| `description` | String | ❌ No | Product description |
| `categoryId` | Number | ❌ No | Category ID |

**Example cURL (Update with image):**
```bash
curl -X PUT http://localhost:5000/api/products/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/new-image.jpg" \
  -F "price=550000" \
  -F "stock=20"
```

**Example cURL (Update without image):**
```bash
curl -X PUT http://localhost:5000/api/products/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "price=550000" \
  -F "stock=20"
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Produk berhasil diupdate"
}
```

**Success Response (200) - with image:**
```json
{
  "status": true,
  "message": "Produk berhasil diupdate",
  "fileInfo": {
    "filename": "1714398001234-5678.jpg",
    "size": 245678,
    "path": "backend/uploads/products/1714398001234-5678.jpg"
  }
}
```

---

## File Upload Configuration

### Multer Config (`backend/config/multer.js`)
- **Storage:** Disk storage dengan timestamped filenames
- **Destination:** `backend/uploads/products/` untuk products
- **Allowed Types:** JPG, PNG, GIF, PDF
- **Max File Size:** 5 MB
- **Filename Format:** `{timestamp}-{random}.{ext}`

### File Validation Middleware
- **handleFileUploadError:** Menangani multer errors (file size, invalid type, etc.)
- **validateFilePresence:** File wajib ada (untuk CREATE)
- **validateFilePresenceOptional:** File opsional (untuk UPDATE)

---

## Database Storage

File path disimpan di kolom `products.image` dengan format:
```
backend/uploads/products/1714398001234-5678.jpg
```

### Query untuk GET Product dengan Image:
```sql
SELECT id, name, price, stock, description, image, categoryId 
FROM products 
WHERE id = ?;
```

Response akan include field `image` dengan file path.

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `NO_FILE_PROVIDED` | 400 | File tidak disertakan saat create product |
| `FILE_SIZE_EXCEEDED` | 413 | Ukuran file > 5MB |
| `TOO_MANY_FILES` | 400 | Terlalu banyak files di-upload |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Tipe file tidak didukung |
| `MULTER_ERROR` | 400 | Multer error lainnya |

---

## Testing dengan Postman

### 1. Setup dalam Postman:
- Pilih method: **POST** (create) atau **PUT** (update)
- Set URL: `http://localhost:5000/api/products` atau `http://localhost:5000/api/products/:id`
- Go to **Body** tab
- Pilih **form-data**

### 2. Add form fields:
- Set header `Authorization` dengan Bearer token
- Add field `image` dengan type **File**, pilih file dari computer
- Add field lainnya sebagai **Text**

### 3. Click Send

---

## Backend Structure

```
backend/
├── config/
│   └── multer.js              # Multer configuration
├── controllers/
│   ├── productController.js   # Product handlers (create, update, etc)
│   └── uploadController.js    # Upload utility functions
├── middleware/
│   └── fileValidation.js      # File validation & error handling
├── routes/
│   └── productRoutes.js       # Product routes dengan upload middleware
├── models/
│   └── productModel.js        # Database queries
└── uploads/
    └── products/              # Uploaded product images
```

---

## Important Notes

1. **File Path Storage:** Path disimpan relatif dari project root untuk consistency
2. **File Cleanup:** File yang di-upload tetap di disk; pastikan implementasi cleanup jika diperlukan
3. **Concurrent Uploads:** Multer handle concurrent file uploads secara safe
4. **Error Handling:** Semua file upload errors sudah ditangani di middleware
5. **Authorization:** Hanya admin yang bisa create/update products dengan files

