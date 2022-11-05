import * as Google from 'expo-auth-session/providers/google';
import { maybeCompleteAuthSession } from "expo-web-browser";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../clients/api';

maybeCompleteAuthSession();

interface UsuarioProps {
  nome: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextDataProps {
  isLogged: boolean;
  isLoading: boolean;
  usuario: UsuarioProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>({} as UsuarioProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: '',
    redirectUri: '',
    scopes: ['profile', 'email']
  })

  async function signIn() {
    // Para pegar o redirect deep link com schema 
    // console.log('>>>>> Vamos logar!', makeRedirectUri({ useProxy: true }))

    try {
      setIsLoading(true)
      await promptAsync();
    } catch (e: any) {
      console.error(e);
      throw e;
    } finally {
      setIsLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsLoading(true)

      const resSignUp = await api.post('/signUp', {
        access_token
      })

      if (resSignUp.status !== 200) {
        throw new Error(resSignUp.data)
      }

      api.defaults.headers.common["Authentication"] = `Bearer ${resSignUp.data.token}`

      const resMe = await api.get('/me')

      if (resMe.status !== 200) {
        throw new Error(resSignUp.data)
      }

      setUsuario(resMe.data)
      setIsLogged(true)
    } catch (e: any) {
      api.defaults.headers.common["Authentication"] = ``
      setUsuario({} as UsuarioProps)
      setIsLogged(false)
      console.error(e)
      throw e;
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }

  }, [response])

  return <AuthContext.Provider
    value={{
      signIn,
      isLoading,
      isLogged,
      usuario
    }}
  >
    {children}
  </AuthContext.Provider>
}