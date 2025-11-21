import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EmployeeCard from "../components/EmployeeCard";
import Header from "../components/Header";
import { useData } from "../context/DataContext";
import { useAppNavigation } from "../navigation/useAppNavigation";
import { colors } from "../theme/colors";
import { Employee } from "../types/Employee";

const EmployeesListScreen = () => {
  const navigation = useAppNavigation();
  const { employees, addEmployee } = useData();
  const [newName, setNewName] = useState("");

  const sortedEmployees = useMemo(
    () =>
      [...employees].sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })),
    [employees],
  );

  const handleAddEmployee = async () => {
    if (!newName.trim()) {
      Alert.alert("Informe o nome", "Digite o nome do colaborador.");
      return;
    }
    const created = await addEmployee(newName.trim());
    if (created) {
      setNewName("");
    }
  };

  const renderItem: ListRenderItem<Employee> = ({ item }) => (
    <EmployeeCard
      name={item.name}
      notesCount={item.notes.length}
      onPress={() => navigation.navigate("EmployeeDetail", { employeeId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="Funcionários"
        subtitle="Organize notas e insights por pessoa."
        action={
          employees.length > 0 ? (
            <Text style={styles.counter}>{employees.length} cadastrados</Text>
          ) : undefined
        }
      />
      <View style={styles.newEmployeeCard}>
        <Text style={styles.newEmployeeTitle}>Novo colaborador</Text>
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
        />
        <Pressable style={styles.addButton} onPress={handleAddEmployee}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </Pressable>
      </View>
      {employees.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum funcionário ainda</Text>
          <Text style={styles.emptyDescription}>
            Cadastre colaboradores e vincule notas para acompanhar o histórico do time.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedEmployees}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  counter: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  newEmployeeCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  newEmployeeTitle: {
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  emptyDescription: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default EmployeesListScreen;
