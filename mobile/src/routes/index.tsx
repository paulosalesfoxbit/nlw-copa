import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';
import { useAuth } from '../hooks/useAuth';
import { SignIn } from '../screens/SignIn';
import { AppRoutes } from './app.routes';

export function Routes() {
  const { isLogged } = useAuth();

  return (
    // esta box evita um flick na mudanca de telas
    <Box flex={1} bg={'gray.900'}>
      <NavigationContainer>
        {isLogged ? <AppRoutes /> : <SignIn />}:
      </NavigationContainer>
    </Box>
  )
}