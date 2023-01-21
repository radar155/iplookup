import { Request, Response, NextFunction } from 'express'
import {GetLookupRequest} from '../types'

export const auth = async (req: GetLookupRequest, res: Response, next: NextFunction) => {
    try {
        /*
            this function should check if some token was provided in the request object
            and if such token is valid.

            Here, for convenience, we attach the user_id 1 in the request object to make it available to next middlewares
        */
       req.user_id = 1
       next()
    } catch (e) {
        res.status(401).end()
    }
}