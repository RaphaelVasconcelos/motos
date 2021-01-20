import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../utils/database';

interface ErrorResponseType {
    error: string;
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | object[]>
): Promise<void> => {
    if (req.method === 'GET') {
        const modelo = req.query.modelo as string;

        if (! modelo) {
            res.status(400).json({ error: "Missing modelo parameter on request body" });
            return;
        }
        const { db } = await connect();

        const response = await db
            .collection("motos")
            .find({ modelo: { $in: [new RegExp(`${modelo}`, 'i')] } })
            .toArray();

        if (response.length === 0) {
            res.status(400).json({ error: 'Modelo not found' });
            return;
        }

        res.status(200).json(response);
    } else {
        res.status(400).json({ error: 'Wrong request method' });
    }
};