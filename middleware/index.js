
// object that will hold all middleware functions. therefore when using middleware functions
// will use dot notation to call the appriorate functions
var middlewareObj = {}

// note: middleware function signature is to have 3 arguments. the same 
// request and respond object arguments as a normal URL handler but then a third
// called NEXT that is the function that is to be called after the middleware executes (ie like the normal URL handler once the middleware does its job)
middlewareObj.isLoggedIn = function(req, res, next) {
    // then check if the person is logged in
}