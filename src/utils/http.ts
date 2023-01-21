import axios from "axios"
import { IpData } from '../types'

export const getIpDataHTTP = async (ip: string) : Promise<IpData> => {
    const result = await axios.get<IpData>(`http://ipwho.is/${ip}`)
    return result.data
}