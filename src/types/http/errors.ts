import { Response } from 'express'
interface Error500Body {
    message: string
}

export type Error500Response = Response<Error500Body>