import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client'

import useSWR from 'swr';
import api from '../utils/api';


import Nav from '../components/nav';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage: NextPage = () => {
    const [session, loading] = useSession()

    const [nome, setNome] = useState(null);
    const [email, setEmail] = useState(null);
    const [moto, setMoto] = useState(null);
    const [errorCount, setErrorCount] = useState(0);

    const [loggeduserWithoutAccount, setLoggedUserWithoutAccount] = useState(false);

    const { data, error } = useSWR(
        !loggeduserWithoutAccount && !loading 
            ? `api/user/${session?.user.email}` 
            : null,
        api
    );

    useEffect(() => {
        setErrorCount((prevstate) => prevstate + 1);
        if ([error] && errorCount === 1) setLoggedUserWithoutAccount(true);
    }, [error, setErrorCount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {
            nome,
            email,
            moto,
        };
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, data);
            setLoggedUserWithoutAccount(false);
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div>
            <Nav />
            {!session && (
                <div className="text-3xl">
                    Favor fazer o login para acessar essa página <br />
                    <button onClick={(): Promise<void> => signIn("auth0")}>
                        Sign in
          </button>
                </div>
            )}
            {session && data && (
                <>
                    <h1>Bem vindo a página de profile</h1>
                    <div className="text-3xl">

                        Signed in as {session.user.email} <br />
                        <button onClick={(): Promise<void> => signOut()}>Sign out</button>
                    </div>
                    <p>{data.data.nome}</p>
                    <p>{data.data.moto}</p>
                    <p>{data.data.km} KMs</p>
                </>
            )}
            {loggeduserWithoutAccount && (
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl"> Seja bem vindo ao Motos!</h1>
                    <h1 className="text-2xl"> Por favor complete o seu cadastro</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => { setNome(e.target.value) }}
                            placeholder="Full name"
                            className="bg-blue-200 my-2" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="E-mail"
                            className="bg-blue-200 my-2" />
                        <input
                            type="text"
                            value={moto}
                            onChange={(e) => { setMoto(e.target.value) }}
                            placeholder="Moto owner"
                            className="bg-blue-200 my-2" />
                        <button className="btn-green" type="submit">
                            Criar profile
                        </button>
                    </form>
                </div>
            )}
            {loading && (
                <div className="text-5xl">
                    <h1>CARREGANDO</h1>
                </div>
            )}
        </div>
    )
}

export default ProfilePage;