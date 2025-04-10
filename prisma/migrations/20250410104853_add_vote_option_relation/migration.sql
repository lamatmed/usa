-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_choice_fkey";

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_choice_fkey" FOREIGN KEY ("choice") REFERENCES "VoteOption"("label") ON DELETE CASCADE ON UPDATE CASCADE;
