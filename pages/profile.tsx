import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client'

import useSWR from 'swr';
import api from '../utils/api';


import Nav from '../components/nav';

const SearchPage: NextPage = () => {
    const [session, loading] = useSession()

    const { data, error } = useSWR(`api/user/${session?.user.email}`, api);

    if (error) {
        console.log(error);
    }

    if (data) {
        console.log(data);
    }


    return (
        <div>
            <Nav />
            <h1>Profile</h1>
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
                    <p>{data.data.kms} KMs</p>
                </>
            )}
            {error && <h1>O usuário com e-mail {session.user.email} não existe</h1>}
            {loading && (
                <div className="text-5xl">
                    <h1>CARREGANDO</h1>
                </div>
            )}
        </div>
    )
}

export default SearchPage;