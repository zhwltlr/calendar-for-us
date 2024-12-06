/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
DELETE FROM "User";

INSERT INTO "User" (id, password, "createdAt", "updatedAt")
VALUES ('sweetpotato','$2a$10$jFMX8YIJGIt12RCCmol/JePZ0u.wZVV72XcsKDC8L6pl.LXYzZU.u', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "User" (id, password, "createdAt", "updatedAt")
VALUES ('potato','$2a$10$s.vEOmiug7OKkGHGEPA/XOUtCQLpeeBGFaFuMQCkAcKUPXT/wZ2ii', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);