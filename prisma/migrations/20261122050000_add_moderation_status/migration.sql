-- Add review state to every menfess. Existing posts are kept public for
-- backward compatibility; future submissions start in PENDING in the server action.
ALTER TABLE "Menfess" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';

-- Keep previously published entries visible; all future submissions explicitly
-- start in PENDING state in the server action.
UPDATE "Menfess" SET "status" = 'APPROVED';

CREATE INDEX "Menfess_status_createdAt_idx" ON "Menfess"("status", "createdAt");
