import db from '../database/db_connection'
import { IpData } from '../types'

export const getIpDataDL = async (ip: string) : Promise<IpData | null> => {
    const result = await db('ip')
        .where('ip', ip)
        .select<{data: IpData}[]>('data')
    
    if (result.length)
        return result[0].data
    
    return null
}

export const insertIpDataDL = async (ip: string, data: IpData) : Promise<void> => {
    const result = await db('ip')
        .insert({
            ip, data
        })
        .onConflict().ignore()
}

export const deleteIpDL = async (ip: string) : Promise<void> => {
    await db('ip')
        .del()
        .where('ip', ip)
}