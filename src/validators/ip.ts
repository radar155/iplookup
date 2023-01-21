import {param, validationResult, matchedData} from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { GetLookupRequest } from '../types'

export const getIpValidator = [
    param('ip').isIP(),
    (req: GetLookupRequest, res: Response, next: NextFunction) => {
        
        const errors = validationResult(req);
        
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        
        req.query = matchedData(req, { locations: ['params'], includeOptionals: true })

        next()
    }
]