import dotenv from 'dotenv'
dotenv.config()
import app from './app'
import db from './database/db_connection'

(async() => {
    try {
        await db.raw('SELECT 1 = 1')
        console.log('Postgres connection made')
        
        app.listen(3000, () => {
            console.log('Server listening on port 3000');
        })
    
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()

