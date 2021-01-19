import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../utils/database';

interface ErrorResponseType {
    error: string;
}

interface SuccessResponseType{
    nome: string;
    email: string;
    moto: string;
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType>
): Promise<void> => {
    if (req.method === 'POST'){
        const { nome,
                email,
                moto
              } =  req.body;
        
        if (!nome || !email || !moto){
            res.status(400).json({ error: "Missing body parameter"});
            return;
        }
        const { db } = await connect();
        
        const response = await db.collection('users').insertOne({
            nome,
            email,
            moto,
            km: 1
        });

        res.status(200).json(response.ops[0]);
    } else if (req.method === "GET"){
        const { email } =  req.body;

        if(!email){
            res.status(400).json({error: 'Missing e-mail on request body'});
            return;
        }

        const { db } = await connect();

        const response = await db.collection('users').findOne({ email });

        if(!response){
            res.status(400).json({error: 'User with this e-mail not found'});
            return;
        }

        res.status(200).json(response);
    } else {
        res.status(400).json({error: 'Wrong request method'});
    }
    

    
};