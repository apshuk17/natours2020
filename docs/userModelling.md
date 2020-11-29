User Schema has following fields:
1. name - A required field with String data type
2. email - A required field with String data type. Also unique and lowercase. Validate using a 
npm module called Validator.
3. password - A required field with String data type. Minimum 8 characters.
4. passwordConfirm - A required field with String data type.
5. photo - An optional field with String data type.
6. passwordChangedAt: An optional field with Date data type.