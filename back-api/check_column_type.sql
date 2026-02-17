SELECT column_name, data_type, datetime_precision 
FROM information_schema.columns 
WHERE table_name = 'PetAdQuestionReplies' 
  AND column_name = 'CreatedAt';
