import { getIpController } from '../src/controllers/ip'
import * as lookupService from '../src/service/ip'
import { GetLookupRequest, GetLookupResponse, IpData } from '../src/types';
import { NextFunction } from 'express'

jest.mock('../src/data_layer/ip', () => jest.fn()) // this is just to ensure DL import to not happen

describe('lookupController', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('lookupController', () => {

        test('It should call next() if service throws an error', async () => {
            const e = new Error('mock_error')
            
            jest.spyOn(lookupService, 'getIpService')
                .mockImplementation((ip: string) : Promise<IpData> => {
                    throw e
                })

            const mockRequest = {
                params: {
                    ip: '8.8.8.8'
                },
                user_id: 1
            } as unknown as GetLookupRequest

            const mockResponse = {} as GetLookupResponse
            const mockNext = jest.fn() as NextFunction

            await getIpController(mockRequest, mockResponse, mockNext)

            expect(lookupService.getIpService).toHaveBeenCalled()
            expect(lookupService.getIpService).toHaveBeenCalledTimes(1)
            expect(lookupService.getIpService).toHaveBeenCalledWith(mockRequest.params.ip)
            expect(mockNext).toHaveBeenCalled()
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockNext).toHaveBeenCalledWith(e)
        })

        test('It should call res.status().json() if service returns', async () => {
            
            const r = {"ip":"8.8.8.8","success":true,"type":"IPv4","continent":"North America","continent_code":"NA","country":"United States","country_code":"US","region":"California","region_code":"CA","city":"Mountain View","latitude":37.3860517,"longitude":-122.0838511,"is_eu":false,"postal":"94039","calling_code":"1","capital":"Washington D.C.","borders":"CA,MX","flag":{"img":"https://cdn.ipwhois.io/flags/us.svg","emoji":"🇺🇸","emoji_unicode":"U+1F1FA U+1F1F8"},"connection":{"asn":15169,"org":"Google LLC","isp":"Google LLC","domain":"google.com"},"timezone":{"id":"America/Los_Angeles","abbr":"PST","is_dst":false,"offset":-28800,"utc":"-08:00","current_time":"2023-01-21T06:25:05-08:00"}}
            jest.spyOn(lookupService, 'getIpService')
                .mockImplementation((ip: string) : Promise<IpData> => {
                    return Promise.resolve(r)
                })

            const mockRequest = {
                params: {
                    ip: '8.8.8.8'
                },
                user_id: 1
            } as unknown as GetLookupRequest

            const mockResponse = {
                status: jest.fn(() => mockResponse),
                json: jest.fn(() => mockResponse),
            } as unknown as GetLookupResponse
            const mockNext = jest.fn() as NextFunction

            await getIpController(mockRequest, mockResponse, mockNext)

            expect(lookupService.getIpService).toHaveBeenCalled()
            expect(lookupService.getIpService).toHaveBeenCalledTimes(1)
            expect(lookupService.getIpService).toHaveBeenCalledWith(mockRequest.params.ip)
            expect(mockResponse.status).toHaveBeenCalled()
            expect(mockResponse.status).toHaveBeenCalledTimes(1)
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalled()
            expect(mockResponse.json).toHaveBeenCalledTimes(1)
            expect(mockResponse.json).toHaveBeenCalledWith(r)
        })
    })
})