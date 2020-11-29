Password management is happening at model layer of MVC. This model layer is made up of mongoose.

1. Comparison of password and passwordConfirm will happen inside the validate key of passwordConfirm.
But, this validation only works with "Model.create", which is equivalent to "Model.prototype.save".
It will not work with "Model.insertMany". Therefore, whenever we update a user we'll not use
"Model.findOneAndUpdate" because its not calling "Model.prototype.save" and hence will not run this
validation.

2. In this step we'll do the password encryption. We are doing this using mongoose document middleware.
We are going to use mongoose "pre" hook on "Model.prototype.save".
Always remember, this pre save hook will run just before the data is going to persist in the database.
Hence, this will run after initial validations defined in the userSchema.

Now, in this pre hook function we'll check whether the password is modified in the current document or not. This approach will work with both type of documents, i.e., new and that needs to be updated.
Because, we are going to use "Model.prototype.save" for user update operation as well. So, we don't
want to encrypt the password if user didn't modified the existing password.

We'll encrypt the password using bcrypt.hash, but now we don't have any requirement to encrypt and save
passwordConfirm to database. Hence, in the same pre hook function we'll assign "undefined" to the
passwordConfirm field and now mongoose will not save this field to tha database.