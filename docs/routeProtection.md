Following authentication steps to perform while doing route protection

1. Check the token presence in the "Authorization" request header.
   a. If there is no token, return an unauthorized error with status code 401 and message "No logged
   in user".
   b. If there is token, then split the "Bearer" and token value and then check the Token signature is valid.
    1. Use jwt.verify to verify the token signature, if it invalid then we'll get
    JsonWebTokenError which we'll handle in error controller.
    2. While performing verification, if token is expired we'll get an error of type
    TokenExpiredError which we'll handle in error controller.
    3. If token is valid we'll get the user id as a result of jwt.verify
    which was used as a payload during token creation and then fetch the user from database using the same decoded value. If user still exist in the database then we'll proceed
    otherwise, we'll throw an unauthorized error with status 401, saying this user does not
    exist in the database anymore. 3. Token is not issued before last password changed.
   c. If token is verified, then we need to check the token issued at timestamp.
    1. To achieve this, we added a new field in the userSchema, called passwordChangedAt
    which is of date type. We also added a new document instance method in user model,
    called changedPasswordAfter to compare the timestamp of token issued at and passwordChangedAt.
    2. changedPasswordAfter will return false, which means either password never changed or the time
    when password last changed is less than the JWTIssuedAtTimestamp, i.e.,
    password was changed before the token was issued.
    3. Now use this instance method with the currentUser, which we fetched from database using decoded
    id. Along with user id, we'll also receive "iat" and "exp" in the decoded object. If changedPasswordAfter returns true, then we'll again throw an unauthorized error with a message,
    "User has recently changed the password. Please login again."
    4. If token passes all there barricades, then we'll add this currentUser in the request and
    pass the request to the next middleware handling the API logic.

