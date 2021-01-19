import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../utils/database';

interface ErrorResponseType {
    error: string;
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | object[]> 
): Promise<void> => {
    if (req.method === 'GET'){
        const { estilo } =  req.body;
        
        if (!estilo){
            res.status(400).json({ error: "Missing estilo parameter on request body"});
            return;
        }
        const { db } = await connect();
        
        const response = await db.collection('motos').find({ estilo: estilo}).toArray();

        if(response.length === 0){
            res.status(400).json({error: 'Modelo not found'});
            return;
        }

        res.status(200).json(response);
    } else {
        res.status(400).json({error: 'Wrong request method'});
    }
};