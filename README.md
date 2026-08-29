# Codex Agent World

โลกออฟฟิศ 3D ของ AI Agent ที่สร้างจาก snapshot ใน `~/.codex/skills/**/agents/openai.yaml`

## Build สำหรับ Hostinger

โปรเจกต์มี build แยกสำหรับ Hostinger เพื่อให้ได้ static website ที่มี `index.html` อยู่ระดับแรกของโฟลเดอร์ deploy

```bash
npm install
npm run build:hostinger
```

ผลลัพธ์อยู่ใน `hostinger-dist/` ให้อัปโหลด **ไฟล์ภายในโฟลเดอร์นี้** ไปยัง `public_html` โดยตรง ไม่ควรอัปโหลดโฟลเดอร์ `hostinger-dist` ครอบอีกชั้น

หากใช้ Git deployment ใน hPanel ให้เลือกสาขา `hostinger` ซึ่งมีไฟล์ deploy พร้อมใช้งานและมี `index.html` อยู่ที่ root

## Build สำหรับ OpenAI Sites

```bash
npm run build
```

คำสั่งเดิมยังคงสร้าง Vinext/Cloudflare Worker output ใน `dist/` สำหรับ OpenAI Sites และไม่ควรนำ output นี้ไปใส่ `public_html` ของ Hostinger
