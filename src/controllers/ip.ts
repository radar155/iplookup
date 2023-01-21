import { NextFunction } from 'express'
import { GetLookupRequest, GetLookupResponse, IpData } from '../types';
import { getIpService, deleteIpService } from '../service/ip'

export const getIpController = async (req: GetLookupRequest, res: GetLookupResponse, next: NextFunction) => {
    try {
        const IpData: IpData = await getIpService(req.params.ip)
        return res.status(200).json(IpData)
    } catch (e) {
        next(e)
    }
}

export const deleteIpController = async (req: GetLookupRequest, res: GetLookupResponse, next: NextFunction) => {
    try {
        await deleteIpService(req.params.ip)
        return res.status(200).send()
    } catch (e) {
        next(e)
    }
}

