/*
  Warnings:

  - The primary key for the `Menfess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `message` on the `Menfess` table. All the data in the column will be lost.
  - You are about to drop the column `recipientName` on the `Menfess` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Menfess` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Menfess` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `content` to the `Menfess` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menfess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderName" TEXT,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#FFF4CC',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Menfess" ("createdAt", "id", "senderName", "updatedAt") SELECT "createdAt", "id", "senderName", "updatedAt" FROM "Menfess";
DROP TABLE "Menfess";
ALTER TABLE "new_Menfess" RENAME TO "Menfess";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
