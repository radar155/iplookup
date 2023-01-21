import { getIpService } from '../src/service/ip'
import * as http from '../src/utils/http'
import { IpData } from '../src/types';

const mockData: IpData = {"ip":"8.8.8.8","success":true,"type":"IPv4","continent":"North America","continent_code":"NA","country":"United States","country_code":"US","region":"California","region_code":"CA","city":"Mountain View","latitude":37.3860517,"longitude":-122.0838511,"is_eu":false,"postal":"94039","calling_code":"1","capital":"Washington D.C.","borders":"CA,MX","flag":{"img":"https://cdn.ipwhois.io/flags/us.svg","emoji":"🇺🇸","emoji_unicode":"U+1F1FA U+1F1F8"},"connection":{"asn":15169,"org":"Google LLC","isp":"Google LLC","domain":"google.com"},"timezone":{"id":"America/Los_Angeles","abbr":"PST","is_dst":false,"offset":-28800,"utc":"-08:00","current_time":"2023-01-21T06:25:05-08:00"}}

jest.mock('../src/data_layer/ip', () => {
    return {
        getIpDataDL: jest.fn(),
        insertIpDataDL: jest.fn()
    }
}) // this is just to ensure DL db_connection import to not happen

import * as DL from '../src/data_layer/ip'

describe('lookupService', () => {

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
    })

    describe('getLookupService', () => {

        test('It should throw error if DL throws an error', async () => {
            const e = new Error('mock_error')
            
            jest.spyOn(DL, 'getIpDataDL')
                .mockImplementation((ip: string) : Promise<IpData | null> => {
                    throw e
                })
            
            let is_throw: boolean = false
            try {
                await getIpService('8.8.8.8')  
            } catch (e2) {
                is_throw = true
                expect(DL.getIpDataDL).toHaveBeenCalled()
                expect(DL.getIpDataDL).toHaveBeenCalledTimes(1)
                expect(DL.getIpDataDL).toHaveBeenCalledWith('8.8.8.8')
                expect(e2).toBe(e)
            }

            expect(is_throw).toBe(true)

        })

        test('It should throw error if HTTP throws an error', async () => {
            const e = new Error('mock_error')
            
            jest.spyOn(DL, 'getIpDataDL')
                .mockImplementation((ip: string) : Promise<IpData | null> => {
                    return Promise.resolve(null)
                })

            jest.spyOn(http, 'getIpDataHTTP')
                .mockImplementation((ip: string) : Promise<IpData> => {
                    throw e
                })
            
            let is_throw: boolean = false
            try {
                await getIpService('8.8.8.8')  
            } catch (e2) {
                is_throw = true
                expect(DL.getIpDataDL).toHaveBeenCalled()
                expect(DL.getIpDataDL).toHaveBeenCalledTimes(1)
                expect(DL.getIpDataDL).toHaveBeenCalledWith('8.8.8.8')
                expect(http.getIpDataHTTP).toHaveBeenCalled()
                expect(http.getIpDataHTTP).toHaveBeenCalledTimes(1)
                expect(http.getIpDataHTTP).toHaveBeenCalledWith('8.8.8.8')
                expect(e2).toBe(e)
            }

            expect(is_throw).toBe(true)

        })

        test('It should return mock data if no error occours (from HTTP)', async () => {
            
            jest.spyOn(DL, 'getIpDataDL')
                .mockImplementation((ip: string) : Promise<IpData | null> => {
                    return Promise.resolve(null)
                })

            jest.spyOn(http, 'getIpDataHTTP')
                .mockImplementation((ip: string) : Promise<IpData> => {
                    return Promise.resolve(mockData)
                })
            
            jest.spyOn(DL, 'insertIpDataDL')
                .mockImplementation((ip: string, data: IpData) : Promise<void> => {
                    return Promise.resolve()
                })
            
            const result = await getIpService('8.8.8.8')

            expect(DL.getIpDataDL).toHaveBeenCalled()
            expect(DL.getIpDataDL).toHaveBeenCalledTimes(1)
            expect(DL.getIpDataDL).toHaveBeenCalledWith('8.8.8.8')
            expect(http.getIpDataHTTP).toHaveBeenCalled()
            expect(http.getIpDataHTTP).toHaveBeenCalledTimes(1)
            expect(http.getIpDataHTTP).toHaveBeenCalledWith('8.8.8.8')
            expect(DL.insertIpDataDL).toHaveBeenCalled()
            expect(DL.insertIpDataDL).toHaveBeenCalledTimes(1)
            expect(DL.insertIpDataDL).toHaveBeenCalledWith('8.8.8.8', mockData)
            expect(result).toBe(mockData)
        })

        test('It should return mock data if no error occours (from DB)', async () => {
            
            jest.spyOn(DL, 'getIpDataDL')
                .mockImplementation((ip: string) : Promise<IpData | null> => {
                    return Promise.resolve(mockData)
                })

            jest.spyOn(http, 'getIpDataHTTP')

            
            jest.spyOn(DL, 'insertIpDataDL')

            
            const result = await getIpService('8.8.8.8')

            expect(DL.getIpDataDL).toHaveBeenCalled()
            expect(DL.getIpDataDL).toHaveBeenCalledTimes(1)
            expect(DL.getIpDataDL).toHaveBeenCalledWith('8.8.8.8')
            expect(http.getIpDataHTTP).not.toHaveBeenCalled()
            expect(DL.insertIpDataDL).not.toHaveBeenCalled()
            expect(result).toBe(mockData)
        })

    })
})