import * as Google from 'expo-auth-session/providers/google';
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useToast } from 'native-base';
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
  const toast = useToast();
  const [usuario, setUsuario] = useState<UsuarioProps>({} as UsuarioProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_ID,
    redirectUri: process.env.REDIRECT_URI,
    scopes: ['profile', 'email']
  })

  async function signIn() {
    // console.log('Para pegar o redirect deep link com schema !', makeRedirectUri({ useProxy: true }))
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

      api.defaults.headers.common["Authorization"] = `Bearer ${resSignUp.data}`

      const resMe = await api.get('/me')

      setUsuario(resMe.data)
      setIsLogged(true)
    } catch (e: any) {
      api.defaults.headers.common["Authentication"] = ``
      setUsuario({} as UsuarioProps)
      setIsLogged(false)
      console.error(e)
      toast.show({
        title: 'Não autorizado!',
        placement: 'top',
        bgColor: 'red.500'
      })
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