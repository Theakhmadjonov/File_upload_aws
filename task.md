
# 📁 Fayl Saqlash Xizmati (NestJS + S3)

Minimal Dropbox/Google Drive kloni bo‘lib, foydalanuvchi fayllarni yuklaydi, ko‘radi, yuklab oladi va o‘chiradi. Barcha fayllar Amazon S3'da saqlanadi.

---

## 🔐 Avtorizatsiya

* JWT Token asosida amalga oshiriladi
* Har bir foydalanuvchi o‘z fayllarini ko‘ra oladi  

---

## 🧩 Texnologiyalar

* **NestJS** (Modular arxitektura)
* **Prisma ORM** (Fayllarni DB’da saqlash)
* **AWS SDK** (S3 bilan ishlash)
* **Multer + Multer-S3** (Fayl yuklash)
* **Swagger** (API dokumentatsiya)
* **MinIO** (lokal S3 test uchun)

---

## 📦 API Endpointlar

### 1. Faylni yuklash

`POST /files`

**Headers:**

```http
Authorization: Bearer <JWT>
Content-Type: multipart/form-data
```

**Form-data:**

| Key  | Value          |
| ---- | -------------- |
| file | `yourfile.pdf` |
| tags | `"cv,project"` |

**Response (201 Created):**

```json
{
  "id": "clx1f12xq0000t1l6bu7c9fgh",
  "filename": "cv_project.pdf",
  "url": "https://s3.amazonaws.com/your-bucket/user123/cv_project.pdf",
  "tags": ["cv", "project"],
  "createdAt": "2025-05-21T12:34:56.789Z"
}
```

---

### 2. Fayllar ro‘yxati

`GET /files`

**Headers:**

```http
Authorization: Bearer <JWT>
```

**Query (ixtiyoriy):**

```
?tag=cv
```

**Response (200 OK):**

```json
[
  {
    "id": "clx1f12xq0000t1l6bu7c9fgh",
    "filename": "cv_project.pdf",
    "tags": ["cv", "project"],
    "url": "https://s3.amazonaws.com/your-bucket/user123/cv_project.pdf",
    "createdAt": "2025-05-21T12:34:56.789Z"
  },
  {
    "id": "clx1f1q8z0001t1l6bus7b82j",
    "filename": "portfolio.zip",
    "tags": ["project"],
    "url": "https://s3.amazonaws.com/your-bucket/user123/portfolio.zip",
    "createdAt": "2025-05-21T12:40:00.789Z"
  }
]
```

---

### 3. Faylni yuklab olish (presigned URL bilan)

`GET /files/:id/download`

**Headers:**

```http
Authorization: Bearer <JWT>
```

**Response (200 OK):**

```json
{
  "downloadUrl": "https://s3.amazonaws.com/your-bucket/user123/cv_project.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
}
```

📌 Bu URL 1 soat ichida ishlaydi (presigned URL)

---

### 4. Faylni o‘chirish

`DELETE /files/:id`

**Headers:**

```http
Authorization: Bearer <JWT>
```

**Response (200 OK):**

```json
{
  "message": "Fayl muvaffaqiyatli o‘chirildi"
}
```

---

## 🧾 Fayl modeli (Prisma ORM)

```ts
model File {
  id        String   @id @default(cuid())
  userId    String
  filename  String
  s3Key     String
  tags      String[] // ["cv", "project"]
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🧪 Test qilish uchun

```bash
# Fayl yuklash (Curl bilan)
curl -X POST http://localhost:3000/files \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@./cv.pdf" \
  -F "tags=cv,project"
```

---

## 📌 Eslatma

* Fayl nomi foydalanuvchiga xos qilinadi: `userId/originalname`
* Fayl o‘chirilsa, S3’dan ham delete qilinadi
* Har bir foydalanuvchining fayllari faqat o‘ziga tegishli
