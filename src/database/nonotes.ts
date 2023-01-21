import db from './db_connection'
interface test {
    id: number
    name: string
}
async function start () {
    const result = await db<test>('army').select()
}

start()