import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useMemo, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";
import { useData } from "../context/DataContext";
import { useAppNavigation } from "../navigation/useAppNavigation";
import { colors } from "../theme/colors";
import { Message } from "../types/Message";

const ChatScreen = () => {
  const navigation = useAppNavigation();
  const { messages, employees, addMessage, addEmployee, attachNoteToEmployee } = useData();
  const [messageText, setMessageText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Orion",
    });
  }, [navigation]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  const totalNotes = useMemo(
    () => employees.reduce((sum, employee) => sum + employee.notes.length, 0),
    [employees],
  );

  const handleSend = async () => {
    if (!messageText.trim()) {
      return;
    }
    const created = await addMessage(messageText);
    if (created) {
      setMessageText("");
    }
  };

  const openModalForMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId);
    setModalVisible(true);
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployeeId(null);
    setNewEmployeeName("");
  };

  const handleSaveNote = async () => {
    if (!selectedMessageId) {
      return;
    }
    const trimmedName = newEmployeeName.trim();
    if (trimmedName) {
      const createdEmployee = await addEmployee(trimmedName, selectedMessageId);
      if (createdEmployee) {
        closeModal();
      }
      return;
    }

    if (!selectedEmployeeId) {
      Alert.alert("Escolha alguém", "Selecione um funcionário ou crie um novo.");
      return;
    }

    await attachNoteToEmployee(selectedEmployeeId, selectedMessageId);
    closeModal();
  };

  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item }) => (
      <MessageBubble
        text={item.text}
        createdAt={item.createdAt}
        onSave={() => openModalForMessage(item.id)}
      />
    ),
    [openModalForMessage],
  );

  const renderListHeader = useCallback(
    () => (
      <>
        <LinearGradient colors={["#13254C", "#0B1221"]} style={styles.hero}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroEyebrow}>Orion Assistant</Text>
              <Text style={styles.heroTitle}>Chat do time</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="sparkles" color={colors.textPrimary} size={14} />
              <Text style={styles.badgeText}>Beta</Text>
            </View>
          </View>
          <Text style={styles.heroSubtitle}>
            Capture insights, converta em conhecimento e compartilhe com quem constrói o futuro.
          </Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{messages.length}</Text>
              <Text style={styles.heroStatLabel}>mensagens</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{employees.length}</Text>
              <Text style={styles.heroStatLabel}>pessoas</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{totalNotes}</Text>
              <Text style={styles.heroStatLabel}>notas</Text>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Pressable style={[styles.heroButton, styles.heroButtonActive]}>
              <Ionicons name="chatbubble-ellipses" size={15} color={colors.textPrimary} />
              <Text style={styles.heroButtonText}>Chat</Text>
            </Pressable>
            <Pressable style={styles.heroButton} onPress={() => navigation.navigate("Employees")}>
              <Ionicons name="people" size={15} color={colors.textPrimary} />
              <Text style={styles.heroButtonText}>Equipe</Text>
            </Pressable>
            <Pressable style={styles.heroButton} onPress={() => navigation.navigate("Insights")}>
              <Ionicons name="stats-chart" size={15} color={colors.textPrimary} />
              <Text style={styles.heroButtonText}>Insights</Text>
            </Pressable>
          </View>
        </LinearGradient>
        <View style={styles.chatSectionHeader}>
          <Text style={styles.chatSectionTitle}>Mensagens do dia</Text>
          <Text style={styles.chatSectionSubtitle}>
            Registre percepções e transforme em notas para o futuro do trabalho.
          </Text>
        </View>
      </>
    ),
    [employees.length, messages.length, navigation, totalNotes],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Ionicons name="chatbubble-ellipses-outline" size={46} color={colors.secondary} />
        <Text style={styles.emptyTitle}>Inicie a conversa</Text>
        <Text style={styles.emptyDescription}>
          Escreva a primeira mensagem e comece a construir o diário da equipe.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={sortedMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma nova ideia..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" color="#fff" size={18} />
            <Text style={styles.sendButtonText}>Enviar</Text>
          </Pressable>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Header
              title="Salvar como informação"
              subtitle="Associe essa mensagem à pessoa certa."
              action={
                <Pressable onPress={closeModal}>
                  <Ionicons name="close" color={colors.textPrimary} size={22} />
                </Pressable>
              }
            />
            <Text style={styles.sectionTitle}>Funcionários existentes</Text>
            {employees.length === 0 ? (
              <Text style={styles.helperText}>
                Ainda não há funcionários cadastrados. Crie um agora mesmo.
              </Text>
            ) : (
              <ScrollView style={styles.employeeList}>
                {employees.map((employee) => {
                  const selected = selectedEmployeeId === employee.id;
                  return (
                    <Pressable
                      key={employee.id}
                      style={[
                        styles.employeeOption,
                        selected && styles.employeeOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedEmployeeId(employee.id);
                        setNewEmployeeName("");
                      }}
                    >
                      <View>
                        <Text style={styles.employeeName}>{employee.name}</Text>
                        <Text style={styles.employeeNotes}>
                          {employee.notes.length}{" "}
                          {employee.notes.length === 1 ? "nota" : "notas"}
                        </Text>
                      </View>
                      {selected ? (
                        <Ionicons name="checkmark-circle" color={colors.primary} size={22} />
                      ) : (
                        <Ionicons name="ellipse-outline" color={colors.textSecondary} size={20} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
            <Text style={styles.sectionTitle}>Criar novo funcionário</Text>
            <TextInput
              placeholder="Nome do novo colaborador"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={newEmployeeName}
              onChangeText={(text) => {
                setNewEmployeeName(text);
                if (text) {
                  setSelectedEmployeeId(null);
                }
              }}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSaveNote}>
                <Text style={styles.saveButtonText}>Salvar nota</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 160,
    backgroundColor: colors.background,
    gap: 12,
  },
  hero: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroEyebrow: {
    textTransform: "uppercase",
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  heroStat: {
    flex: 1,
    paddingRight: 12,
  },
  heroStatValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  heroStatLabel: {
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontSize: 12,
    marginTop: 2,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  heroButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(10,16,30,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  heroButtonActive: {
    backgroundColor: "rgba(59,130,246,0.3)",
    borderColor: "rgba(59,130,246,0.6)",
  },
  heroButtonText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  chatSectionHeader: {
    marginBottom: 12,
  },
  chatSectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  chatSectionSubtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    marginBottom: 20,
  },
  input: {
    minHeight: 50,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sendButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyDescription: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  helperText: {
    color: colors.textSecondary,
    marginBottom: 12,
  },
  employeeList: {
    maxHeight: 200,
    marginBottom: 12,
  },
  employeeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  employeeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.muted,
  },
  employeeName: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  employeeNotes: {
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ChatScreen;
