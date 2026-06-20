INSERT INTO "Role" ("id", "name", "updatedAt") VALUES
  ('role_customer', 'CUSTOMER', CURRENT_TIMESTAMP),
  ('role_admin', 'ADMIN', CURRENT_TIMESTAMP),
  ('role_manager', 'MANAGER', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO UPDATE SET "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "User" ("id", "email", "passwordHash", "fullName", "roleId", "updatedAt") VALUES
  ('user_admin', 'admin@economic.local', '$2a$10$LNc5PugHPw4mT8vQknCvsukKDb/zF/5OEi.ZEK5aASGGLhMBnHdhu', 'Economic Admin', 'role_admin', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO UPDATE SET "fullName" = EXCLUDED."fullName", "passwordHash" = EXCLUDED."passwordHash", "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Cart" ("id", "userId", "updatedAt") VALUES
  ('cart_admin', 'user_admin', CURRENT_TIMESTAMP)
ON CONFLICT ("userId") DO NOTHING;

INSERT INTO "Category" ("id", "name", "slug", "description", "updatedAt") VALUES
  ('cat_dien_tu', 'Dien tu', 'dien-tu', 'Thiet bi dien tu va am thanh', CURRENT_TIMESTAMP),
  ('cat_phu_kien', 'Phu kien', 'phu-kien', 'Phu kien lam viec va giai tri', CURRENT_TIMESTAMP),
  ('cat_wearable', 'Wearable', 'wearable', 'Thiet bi deo thong minh', CURRENT_TIMESTAMP),
  ('cat_camera', 'Camera', 'camera', 'May anh va thiet bi sang tao noi dung', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Product" ("id", "name", "slug", "description", "price", "salePrice", "sku", "stock", "rating", "isFeatured", "categoryId", "updatedAt") VALUES
  ('prod_airbeat', 'Tai nghe AirBeat Pro', 'tai-nghe-airbeat-pro', 'Am thanh giau chi tiet, chong on chu dong va pin dung ca ngay cho cong viec lan giai tri.', 2490000, 1890000, 'AIRBEAT-PRO', 128, 4.8, true, 'cat_dien_tu', CURRENT_TIMESTAMP),
  ('prod_novakeys', 'Ban phim co NovaKeys M75', 'ban-phim-co-novakeys-m75', 'Layout 75%, switch em, keycap PBT va den nen tinh te cho goc lam viec hien dai.', 1790000, 1490000, 'NOVKEY-M75', 76, 4.7, true, 'cat_phu_kien', CURRENT_TIMESTAMP),
  ('prod_pulse', 'Dong ho thong minh Pulse S', 'dong-ho-pulse-s', 'Theo doi suc khoe, luyen tap, thong bao va thanh toan nhanh trong mot thiet ke toi gian.', 3290000, 2790000, 'PULSE-S', 54, 4.9, true, 'cat_wearable', CURRENT_TIMESTAMP),
  ('prod_vlogcam', 'May anh mini VlogCam 4K', 'may-anh-vlogcam-4k', 'Ghi hinh 4K, chong rung tot va micro ro tieng cho creator can thiet bi nho gon.', 5290000, NULL, 'VLOGCAM-4K', 31, 4.6, false, 'cat_camera', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "price" = EXCLUDED."price",
  "salePrice" = EXCLUDED."salePrice",
  "stock" = EXCLUDED."stock",
  "rating" = EXCLUDED."rating",
  "isFeatured" = EXCLUDED."isFeatured",
  "categoryId" = EXCLUDED."categoryId",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "ProductImage" ("id", "url", "alt", "position", "productId") VALUES
  ('img_airbeat', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'Tai nghe AirBeat Pro', 0, 'prod_airbeat'),
  ('img_novakeys', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', 'Ban phim co NovaKeys M75', 0, 'prod_novakeys'),
  ('img_pulse', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'Dong ho thong minh Pulse S', 0, 'prod_pulse'),
  ('img_vlogcam', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', 'May anh mini VlogCam 4K', 0, 'prod_vlogcam')
ON CONFLICT ("id") DO UPDATE SET
  "url" = EXCLUDED."url",
  "alt" = EXCLUDED."alt",
  "position" = EXCLUDED."position",
  "productId" = EXCLUDED."productId";
