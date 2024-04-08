import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'

export function initialise(passport, getUser, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUser(username)
        if(user === null) {
            return done(null, false, { message:'Could not find user' })
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message:'Passwords don\'t match' })
            }
        } catch(e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy(authenticateUser))

    passport.serializeUser((user, done) => done(null, user.staffID))
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
}