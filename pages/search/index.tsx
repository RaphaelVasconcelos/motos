import { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../../utils/api';
import Nav from '../../components/nav';

import Select from 'react-select';

interface Moto {
  _id: string;
  modelo: string;
  estilo: string;
  cilindrada: number;
  cilindros: number;
}

interface Modelo {
  modelo: string;
}

const SearchPage: NextPage = () => {
  const [session, loading] = useSession();
  const [textInput, setTextInput] = useState('');
  const [data, setData] = useState<Moto[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const teste = () => {
    if(modelos.length === 0){
      api("/api/moto").then((response) => {
        const dataArray: Modelo[] = response.data;
        console.log(dataArray.map(criaObjeto));
        setModelos(dataArray);
      });
    }
  }

  function criaObjeto(item){
    var fullname = {value: item.modelo, label: item.modelo};
    return fullname;
  }

  const optionsTeste = modelos.map(criaObjeto);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  const handleSearch = useCallback(() => {
    console.log(textInput);
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

          <Select onChange={(e) => setTextInput(e["value"])} onClick={teste()} className="w-4/12 my-4" options={optionsTeste} placeholder="Modelo da moto" />

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