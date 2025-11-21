import AsyncStorage from "@react-native-async-storage/async-storage";
import { Employee } from "../types/Employee";

const EMPLOYEE_STORAGE_KEY = "@worknotes/employees";

export const loadEmployees = async (): Promise<Employee[]> => {
  try {
    const stored = await AsyncStorage.getItem(EMPLOYEE_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as Employee[];
  } catch (error) {
    console.error("Erro ao carregar funcionários", error);
    throw error;
  }
};

export const saveEmployees = async (employees: Employee[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      EMPLOYEE_STORAGE_KEY,
      JSON.stringify(employees),
    );
  } catch (error) {
    console.error("Erro ao salvar funcionários", error);
    throw error;
  }
};

