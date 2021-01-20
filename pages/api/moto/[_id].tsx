import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import connect from '../../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  modelo: string;
  estilo: string;
  cilindrada: number;
  cilindros: number;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'GET') {
    const id = req.query._id as string;

    if (!id) {
      res.status(400).json({ error: 'Missing moto ID on request body' });
      return;
    }

    let _id: ObjectID;
    try {
      _id = new ObjectID(id);
    } catch {
      res.status(400).json({ error: 'Wrong objectID' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection("motos").findOne({ _id });

    if (!response) {
      res.status(400).json({ error: `Moto with ID ${_id} not found` });
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};