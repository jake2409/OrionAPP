import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen";
import EmployeesListScreen from "../screens/EmployeesListScreen";
import EmployeeDetailScreen from "../screens/EmployeeDetailScreen";
import InsightsScreen from "../screens/InsightsScreen";
import { colors } from "../theme/colors";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    text: colors.textPrimary,
    card: colors.surface,
    border: colors.border,
  },
};

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: "600" },
  contentStyle: { backgroundColor: colors.background },
};

const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator initialRouteName="Chat" screenOptions={screenOptions}>
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Orion Chat" }}
      />
      <Stack.Screen
        name="Employees"
        component={EmployeesListScreen}
        options={{ title: "Orion Pessoas" }}
      />
      <Stack.Screen
        name="EmployeeDetail"
        component={EmployeeDetailScreen}
        options={{ title: "Ficha Orion" }}
      />
      <Stack.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ title: "Orion Insights" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
