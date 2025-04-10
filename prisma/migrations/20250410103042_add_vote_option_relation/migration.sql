-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_choice_fkey" FOREIGN KEY ("choice") REFERENCES "VoteOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
