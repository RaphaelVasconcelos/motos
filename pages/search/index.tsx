import { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client'

import api from '../../utils/api';
import Nav from '../../components/nav';

interface Moto {
  _id: string;
  modelo: string;
  estilo: string;
  cilindrada: number;
  cilindros: number;
}

const SearchPage: NextPage = () => {
  const [session, loading] = useSession();
  const [textInput, setTextInput] = useState('');
  const [data, setData] = useState<Moto[]>([]);

  const handleSearch = useCallback(() => {
    api(`/api/search/${textInput}`).then((response) => {
      const motos: Moto[] = response.data;
      setData(motos);
    });
  }, [textInput, setData]);

  return (
    <div>
      <Nav />
      <h1>Search</h1>
      {!session && (
        <div className="text-3xl">
          Not signed in <br />
          <button onClick={(): Promise<void> => signIn("auth0")}>Sign in</button>
        </div>
      )}
      {session && (
        <>
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button onClick={(): Promise<void> => signOut()}>Sign out</button>
          </div>
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            type='text'
            placeholder="Modelo da moto"
            className="bg-blue-200"
          />
          <button
            type="submit"
            className="bg-green-200"
            onClick={handleSearch}
          >
            Pesquisar
          </button>
          {data.length !== 0 &&
            data.map((moto) => (
              <Link href={`search/${moto._id}`} key={moto._id}>
                <a>
                  <h1 className="text-3xl" >
                    {moto.modelo}
                  </h1>
                </a>
              </Link>
            ))}
        </>
      )}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}
    </div>
  )
}

export default SearchPage;