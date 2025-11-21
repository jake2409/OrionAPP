import { useCallback, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import { useData } from "../context/DataContext";
import { colors } from "../theme/colors";

const insightsAnimation = require("../../assets/animations/insights.json");

const InsightsScreen = () => {
  const { messages, employees } = useData();
  const animationRef = useRef<LottieView>(null);

  useFocusEffect(
    useCallback(() => {
      const animation = animationRef.current;
      animation?.reset();
      animation?.play();
    }, []),
  );

  const totalNotes = useMemo(() => {
    const ids = new Set<string>();
    employees.forEach((employee) => employee.notes.forEach((noteId) => ids.add(noteId)));
    return ids.size;
  }, [employees]);

  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [messages],
  );

  const highlightedEmployees = useMemo(
    () =>
      [...employees]
        .sort((a, b) => b.notes.length - a.notes.length)
        .slice(0, 3),
    [employees],
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(31,110,235,0.5)", "rgba(13,176,103,0.28)", "rgba(15,17,21,1)"]}
        style={styles.gradient}
        locations={[0, 0.4, 1]}
      />
      <LottieView
        ref={animationRef}
        source={insightsAnimation}
        autoPlay
        loop
        style={styles.animation}
        pointerEvents="none"
        speed={0.7}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Insights rápidos"
          subtitle="Saiba como as notas estão ajudando no futuro do trabalho."
        />
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Clima do time hoje</Text>
          <Text style={styles.heroHighlight}>
            {messages.length > 0 ? "Conversas rolando" : "Hora de iniciar o diálogo"}
          </Text>
          <Text style={styles.heroDescription}>
            {totalNotes} notas conectam {employees.length} colaboradores para decisões rápidas.
          </Text>
          <View style={styles.heroChips}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{messages.length} mensagens</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{employees.length} pessoas</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{totalNotes} notas</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Text style={styles.statLabel}>Mensagens</Text>
            <Text style={styles.statValue}>{messages.length}</Text>
            <Text style={styles.statHint}>Total registrado no chat</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Equipe Orion</Text>
            <Text style={styles.statValue}>{employees.length}</Text>
            <Text style={styles.statHint}>Equipe acompanhada</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Notas salvas</Text>
            <Text style={styles.statValue}>{totalNotes}</Text>
            <Text style={styles.statHint}>Ideias conectadas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Colaboradores em destaque</Text>
        {highlightedEmployees.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum colaborador cadastrado ainda. Salve uma mensagem para começar.
        </Text>
      ) : (
        highlightedEmployees.map((employee) => (
          <View key={employee.id} style={styles.employeeHighlight}>
            <View>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeNotes}>
                {employee.notes.length} {employee.notes.length === 1 ? "nota" : "notas"}
              </Text>
            </View>
            <Text style={styles.employeeTag}>Top</Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Mensagens recentes</Text>
        {recentMessages.length === 0 ? (
          <Text style={styles.emptyText}>O chat ainda está vazio.</Text>
        ) : (
          recentMessages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageTimestamp}>
                {new Date(message.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 4,
  },
  animation: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  heroCard: {
    backgroundColor: "rgba(15,17,21,0.65)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginTop: 8,
    marginBottom: 12,
  },
  heroTitle: {
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },
  heroHighlight: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  heroDescription: {
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  heroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  chip: {
    backgroundColor: "rgba(30,110,235,0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(15,17,21,0.7)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  primaryCard: {
    backgroundColor: "rgba(13,176,103,0.35)",
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 6,
  },
  statHint: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: 12,
  },
  employeeHighlight: {
    backgroundColor: "rgba(15,17,21,0.7)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeName: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  employeeNotes: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  employeeTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  messageCard: {
    backgroundColor: "rgba(15,17,21,0.7)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 10,
  },
  messageText: {
    color: colors.textPrimary,
  },
  messageTimestamp: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
  },
});

export default InsightsScreen;
