const GoogleStrategy =require("passport-google-oauth20").Strategy
const passport=require("passport")

 
passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            callbackURL:"/auth/google/callback",
            scope:['profile','email'],
            //passReqToCallback:true
        },
        function(accessToken,refreshToken,profile,callback){
            callback(null,profile)
        }
    )
);
 
passport.serializeUser((user,done)=>{
    console.log(user)
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})

