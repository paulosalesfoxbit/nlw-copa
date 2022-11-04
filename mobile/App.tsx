import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { useEffect, useState } from 'react';

import { Loading } from './src/components/Loading';
import { AuthContextProvider } from './src/contexts/AuthContext';
import { New } from './src/screens/New';
import { THEME } from './src/styles/theme';

export default function App() {
  const [loadedFonts] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold })
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    /*
    fetch("http://localhost:3333/bolao/count")
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(err => console.error(err))
      */
  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent
        />
        {loadedFonts ? <New /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
