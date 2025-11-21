import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
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
import Header from "../components/Header";
import { useData } from "../context/DataContext";
import { useAppNavigation } from "../navigation/useAppNavigation";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { Message } from "../types/Message";

type Route = RouteProp<RootStackParamList, "EmployeeDetail">;

const EmployeeDetailScreen = () => {
  const route = useRoute<Route>();
  const navigation = useAppNavigation();
  const { employees, messages, updateEmployeeName, removeNoteFromEmployee } = useData();
  const employee = employees.find((emp) => emp.id === route.params.employeeId);
  const [editedName, setEditedName] = useState(employee?.name ?? "");

  useEffect(() => {
    if (employee) {
      setEditedName(employee.name);
      navigation.setOptions({ title: employee.name });
    }
  }, [employee, navigation]);

  const notes: Message[] = useMemo(() => {
    if (!employee) {
      return [];
    }
    return employee.notes
      .map((noteId) => messages.find((message) => message.id === noteId))
      .filter((message): message is Message => Boolean(message));
  }, [employee, messages]);

  const handleRename = async () => {
    if (!employee) {
      return;
    }
    if (!editedName.trim()) {
      Alert.alert("Nome obrigatório", "Digite um novo nome antes de salvar.");
      setEditedName(employee.name);
      return;
    }
    await updateEmployeeName(employee.id, editedName.trim());
    Alert.alert("Atualizado", "Nome atualizado com sucesso.");
  };

  const handleRemove = async (messageId: string) => {
    if (!employee) {
      return;
    }
    await removeNoteFromEmployee(employee.id, messageId);
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteText}>{item.text}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteTimestamp}>
          {new Date(item.createdAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Pressable onPress={() => handleRemove(item.id)}>
          <Text style={styles.removeText}>Remover</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyDescription}>Funcionário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Perfil do colaborador" subtitle="Atualize os dados e revise as notas." />
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={editedName}
          onChangeText={setEditedName}
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
        />
        <Pressable style={styles.saveButton} onPress={handleRename}>
          <Text style={styles.saveButtonText}>Salvar nome</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>Notas vinculadas</Text>
      {notes.length === 0 ? (
        <Text style={styles.emptyDescription}>
          Ainda não há notas para este colaborador. Volte ao chat e salve uma mensagem.
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.notesList}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 12,
  },
  notesList: {
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  noteText: {
    color: colors.textPrimary,
  },
  noteFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTimestamp: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  removeText: {
    color: colors.secondary,
    fontWeight: "600",
  },
  emptyDescription: {
    color: colors.textSecondary,
    marginTop: 20,
  },
});

export default EmployeeDetailScreen;
