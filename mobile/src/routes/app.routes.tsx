import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { Detail } from '../screens/Detail';

import { Find } from '../screens/Find';
import { New } from '../screens/New';
import { Polls } from '../screens/Polls';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();
  const size = sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[600],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          height: sizes[20],
          borderTopColor: colors.gray[800]
        },
        tabBarItemStyle: {}
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
          tabBarLabel: 'Novo Bolão'
        }}
      />
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
          tabBarLabel: 'Meus Bolões'
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{
          tabBarButton: () => null
        }}
      />
      <Screen
        name="details"
        component={Detail}
        options={{
          tabBarButton: () => null
        }}
      />
    </Navigator>
  )
}