-- CreateTable
CREATE TABLE "PostAnalyzedString" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "is_palindrome" BOOLEAN NOT NULL,
    "unique_characters" INTEGER NOT NULL,
    "word_count" INTEGER NOT NULL,
    "sha256_hash" TEXT NOT NULL,
    "character_frequency_map" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostAnalyzedString_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostAnalyzedString_value_key" ON "PostAnalyzedString"("value");

-- CreateIndex
CREATE UNIQUE INDEX "PostAnalyzedString_sha256_hash_key" ON "PostAnalyzedString"("sha256_hash");

-- CreateIndex
CREATE INDEX "PostAnalyzedString_is_palindrome_idx" ON "PostAnalyzedString"("is_palindrome");

-- CreateIndex
CREATE INDEX "PostAnalyzedString_length_idx" ON "PostAnalyzedString"("length");

-- CreateIndex
CREATE INDEX "PostAnalyzedString_word_count_idx" ON "PostAnalyzedString"("word_count");

-- CreateIndex
CREATE INDEX "PostAnalyzedString_sha256_hash_idx" ON "PostAnalyzedString"("sha256_hash");
