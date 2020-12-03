Updtaing password of a logged in user

We need 3 value from the request. This means we will ask user to provide these 3 values
1. passwordCurrent
2. password
3. passwordConfirm

Because user is logged in so first our request will pass through "protect" middleware, which will attach "user" details to the request and will verify all token related verifications.

Now, we'll fetch user details from model using "findById" mongoose method.
Now, compare the "passwordCurrent" from database password. We already have an instance method for this.
If password match is true, update the password and save the user. "passwordChanged" is handled at model layer.

Finally, create a new JWT and send the token with status 200 to client.