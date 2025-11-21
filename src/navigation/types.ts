import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Chat: undefined;
  Employees: undefined;
  EmployeeDetail: { employeeId: string };
  Insights: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

