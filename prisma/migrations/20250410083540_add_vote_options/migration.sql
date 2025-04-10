-- CreateTable
CREATE TABLE "VoteOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "VoteOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoteOption_label_key" ON "VoteOption"("label");
