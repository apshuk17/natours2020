To authorize a route, create a role field in the userSchema.
Now, create a new middleware "restrictTo" in the auth controller. This will be a closure with 
express middleware as its return value.
Since, protectRoute middleware will add user to the request, we'll compare this user's role
with the role passed in "restrictTo" from the routes. If they match, user is authorized to
perform this action.