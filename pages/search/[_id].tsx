import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

interface Moto {
    _id: string;
    modelo: string;
    estilo: string;
    cilindrada: number;
    cilindros: number;
}

export default function motoProfilePage({
    modelo,
    estilo,
    _id }: Moto): JSX.Element {
    return (
        <>
            <h1 className="text-3xl">Modelo {modelo}</h1>
            <h1 className="text-2xl">Estilo {estilo}</h1>
            <h1 className="text-2xl">Id {_id}</h1>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const _id = context.query._id as string;
    const response = await axios.get(`http://localhost:3000/api/moto/${_id}`);
    const moto = response.data

    return {
        props: moto,
    };
};