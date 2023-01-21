import { Request, Response } from 'express'
import { IpData } from '../data'

interface GetLookupRequestParams {
    ip: string
}
export type GetLookupRequest = Request<GetLookupRequestParams, any, any, any>

export type GetLookupResponse = Response<IpData>
