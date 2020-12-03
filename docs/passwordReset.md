Need two new routes
1. ForgotPassword: That will accept only email. Then, it will send resetToken to email.
2. Reset Password: That will accept new password.

Under Forgot password auth controller:
1. Retrieve user from database matching email sent in the POST request from forgotPassword route handler.
2. If user exists, create a new document instance method in the userSchema called "createPasswordResetToken". Now add two new fields in the schema, "passwordResetToken" and
"passwordResetExpires".
3. We'll create a random 32 bit hexadecimal string and called it resetToken. Then we'll hash this
resetToken string and create a timestamp of next 10 minutes and assign these both values to the new
document field created above and return the resetToken
4. Now, we call this instance method on the "user" doc we fetched from database in forgotPassword method in auth controller.
5. We'll call user.save() to update the user in database with two new fields created above.
Please note we are using "save" to update the document and to bypass validation we'll use
"validateBeforeSave" as false.

Now use nodemailer and mailtrap config params to set up sendEmail function in utils/email.js

Now, in forgetPassword route handler in auth controller we are using catchAsync to catch all types of errors. However, there is a special condition, when nodemailer fails to send email. In this special case, we need to reset the "passwordResetToken" and "passwordResetExpires" to undefined. Therefor, we'll add a try catch block.

Now, we'll use resetToken route handler. This will use "PATCH" Http verb since we only need to update
the password.

So, here we'll encrypt the reset token we received from the request param using "crypto". Then we find
a user from database with the same encrypted token and also compare its expiration time.
Both these operations are performed im mongoose's "findOne" method. If we get a user, then in the user
doc we update the following properties:
1. password - Take the value from request param and set it.
2. passwordConfirm - Take the value from request param and set it.
And, delete following properties
1. passwordResetToken - set to undefined
2. passwordResetExpires - set to undefined

And then we'll also upate one more propery and the save the doument. Property is "passwordChangedAt" and set it to "Date.now()". Then we'll save it.

Important, we are calling "user.save()", while updating the user because we need all validations to run
at the model layer before saving the updated user to database.
