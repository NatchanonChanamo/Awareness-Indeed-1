# --- Stage 1: Build aรก ---
# เลือก Node.js เวอร์ชัน 18 เป็น Base Image สำหรับการ Build
FROM node:18-alpine AS build

# ตั้งค่า Working Directory ภายใน Container
WORKDIR /app

# Copy package.json และ package-lock.json เข้าไปก่อน
# เพื่อให้ Docker ใช้ Cache ได้ ทำให้ไม่ต้อง npm install ใหม่ทุกครั้งที่แก้โค้ด
COPY package*.json ./

# ติดตั้ง Dependencies ทั้งหมด
RUN npm install

# Copy โค้ดทั้งหมดของโปรเจกต์เข้าไปใน Container
COPY . .

# รันคำสั่ง Build เพื่อสร้างไฟล์ Production
RUN npm run build

# --- Stage 2: Production Environment ---
# ใช้ Nginx เป็นเซิร์ฟเวอร์สำหรับ Production (เล็กและเร็ว)
FROM nginx:stable-alpine

# Copy ไฟล์ที่ Build เสร็จแล้วจาก Stage 'build' มาใส่ในโฟลเดอร์ของ Nginx
COPY --from=build /app/build /usr/share/nginx/html

# บอก Docker ว่า Container นี้จะทำงานบน Port 80
EXPOSE 80

# คำสั่งที่จะรันเมื่อ Container เริ่มทำงาน
CMD ["nginx", "-g", "daemon off;"]