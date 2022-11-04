import * as Google from 'expo-auth-session/providers/google';
import { maybeCompleteAuthSession } from "expo-web-browser";
import { createContext, ReactNode, useEffect, useState } from "react";

maybeCompleteAuthSession();

interface UsuarioProps {
  nome: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextDataProps {
  isLogged: boolean;
  usuario: UsuarioProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>({} as UsuarioProps);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '',
    redirectUri: '',
    scopes: ['profile', 'email']
  })

  async function signIn() {
    //console.log('>>>>> Vamos logar!', makeRedirectUri({ useProxy: true }))
    try {
      setIsLogged(true)
      await promptAsync();
    } catch (e: any) {
      console.error(e);
      throw e;
    } finally {
      setIsLogged(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    console.log('ACCESS TOKEN GOOGLE', access_token)
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }

  }, [response])

  return <AuthContext.Provider
    value={{
      signIn,
      isLogged,
      usuario
    }}
  >
    {children}
  </AuthContext.Provider>
}