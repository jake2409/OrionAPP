import {
  Alert,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadMessages, saveMessages } from "../storage/messages";
import { loadEmployees, saveEmployees } from "../storage/employees";
import { Message } from "../types/Message";
import { Employee } from "../types/Employee";

type DataContextValue = {
  loading: boolean;
  messages: Message[];
  employees: Employee[];
  addMessage: (text: string) => Promise<Message | null>;
  addEmployee: (name: string, initialNoteId?: string) => Promise<Employee | null>;
  attachNoteToEmployee: (employeeId: string, messageId: string) => Promise<void>;
  updateEmployeeName: (employeeId: string, name: string) => Promise<void>;
  removeNoteFromEmployee: (employeeId: string, messageId: string) => Promise<void>;
  reloadFromStorage: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

type ListUpdater<T> = (prev: T[]) => T[];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const showStorageError = useCallback(() => {
    Alert.alert(
      "Ops!",
      "Não foi possível salvar as informações localmente. Verifique o armazenamento do dispositivo.",
    );
  }, []);

  const persistMessages = useCallback(
    (next: Message[]) => {
      saveMessages(next).catch(showStorageError);
    },
    [showStorageError],
  );

  const persistEmployees = useCallback(
    (next: Employee[]) => {
      saveEmployees(next).catch(showStorageError);
    },
    [showStorageError],
  );

  const updateMessages = useCallback(
    (updater: ListUpdater<Message>) => {
      setMessages((prev) => {
        const next = updater(prev);
        persistMessages(next);
        return next;
      });
    },
    [persistMessages],
  );

  const updateEmployees = useCallback(
    (updater: ListUpdater<Employee>) => {
      setEmployees((prev) => {
        const next = updater(prev);
        persistEmployees(next);
        return next;
      });
    },
    [persistEmployees],
  );

  const hydrate = useCallback(async () => {
    try {
      const [storedMessages, storedEmployees] = await Promise.all([
        loadMessages(),
        loadEmployees(),
      ]);
      setMessages(storedMessages);
      setEmployees(storedEmployees);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os dados salvos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const addMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return Promise.resolve(null);
      }
      const newMessage: Message = {
        id: generateId(),
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      updateMessages((prev) => [...prev, newMessage]);
      return Promise.resolve(newMessage);
    },
    [updateMessages],
  );

  const addEmployee = useCallback(
    (name: string, initialNoteId?: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        return Promise.resolve(null);
      }
      const newEmployee: Employee = {
        id: generateId(),
        name: trimmed,
        notes: initialNoteId ? [initialNoteId] : [],
      };
      updateEmployees((prev) => [...prev, newEmployee]);
      return Promise.resolve(newEmployee);
    },
    [updateEmployees],
  );

  const attachNoteToEmployee = useCallback(
    (employeeId: string, messageId: string) => {
      updateEmployees((prev) =>
        prev.map((employee) => {
          if (employee.id !== employeeId) {
            return employee;
          }
          if (employee.notes.includes(messageId)) {
            return employee;
          }
          return {
            ...employee,
            notes: [...employee.notes, messageId],
          };
        }),
      );
      return Promise.resolve();
    },
    [updateEmployees],
  );

  const updateEmployeeName = useCallback(
    (employeeId: string, name: string) => {
      const trimmed = name.trim();
      updateEmployees((prev) =>
        prev.map((employee) =>
          employee.id === employeeId
            ? { ...employee, name: trimmed || employee.name }
            : employee,
        ),
      );
      return Promise.resolve();
    },
    [updateEmployees],
  );

  const removeNoteFromEmployee = useCallback(
    (employeeId: string, messageId: string) => {
      updateEmployees((prev) =>
        prev.map((employee) =>
          employee.id === employeeId
            ? { ...employee, notes: employee.notes.filter((id) => id !== messageId) }
            : employee,
        ),
      );
      return Promise.resolve();
    },
    [updateEmployees],
  );

  const reloadFromStorage = useCallback(async () => {
    setLoading(true);
    await hydrate();
  }, [hydrate]);

  const value = useMemo(
    () => ({
      loading,
      messages,
      employees,
      addMessage,
      addEmployee,
      attachNoteToEmployee,
      updateEmployeeName,
      removeNoteFromEmployee,
      reloadFromStorage,
    }),
    [
      loading,
      messages,
      employees,
      addMessage,
      addEmployee,
      attachNoteToEmployee,
      updateEmployeeName,
      removeNoteFromEmployee,
      reloadFromStorage,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de DataProvider");
  }
  return context;
};
