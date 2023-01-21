
import { IpData } from '../types'
import { getIpDataDL, insertIpDataDL, deleteIpDL } from '../data_layer/ip'
import { getIpDataHTTP } from '../utils/http'

export const getIpService = async (ip: string) : Promise<IpData> => {
    try {
        let ipData = await getIpDataDL(ip)

        if (ipData)
            return ipData

        
        ipData = await getIpDataHTTP(ip)
        
        insertIpDataDL(ip, ipData).catch(e => {}) // no need to await, just catch any possible error

        return ipData

    } catch (e) {
        throw e
    }
}

export const deleteIpService = async (ip: string) : Promise<void> => {
    try {        
        await deleteIpDL(ip)
    } catch (e) {
        throw e
    }
}