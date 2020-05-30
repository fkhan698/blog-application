const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserEmail, getUserById){
    const authenticateUser = async(email, password, done) => {
        const user = await getUserEmail(email)
        console.log(user)
        console.log(email)
        if(user === null || user === ''){
            return done(null, false, {message: 'No user with that email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password is incorrect'})
            }
        }
        catch(e){
            console.log(e)
            return done(e)
        }
    }
    passport.use(new LocalStrategy ({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })

}
module.exports = initialize