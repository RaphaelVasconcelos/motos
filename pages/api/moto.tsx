import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';

import connect from '../../utils/database';

interface ErrorResponseType {
    error: string;
}
interface SuccessResponseType{
    modelo: string;
    estilo: string;
    ano: number;
    cilindrada: number;
    cilindros: number;
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType | SuccessResponseType[]>
): Promise<void> => {
    if (req.method === 'POST'){
        const session = await getSession({ req })
        if (!session) {
            res.status(400).json({ error: "Please, login first"});
            return;
        } else {
        }

        const { modelo, estilo, ano, cilindrada, cilindros } =  req.body;
        
        if (!modelo || !estilo || !ano || !cilindrada || !cilindros){
            res.status(400).json({ error: "Missing body parameter"});
            return;
        }
        const { db } = await connect();
        
        const response = await db.collection('motos').insertOne({
            modelo,
            estilo,
            ano,
            cilindrada,
            cilindros
        });

        res.status(200).json(response.ops[0]);
    } else if (req.method === "GET") {

        const { db } = await connect();

        const response = await db.collection('motos').find({}).project({modelo:1, _id: 0}).toArray();

        if (!response) {
            res.status(400).json({ error: 'Motos not found' });
            return;
        }

        res.status(200).json(response);
    } else {
        res.status(400).json({error: 'Wrong request method'});
    }
};