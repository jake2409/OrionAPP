import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { Employee } from "../types/Employee";

type EmployeeCardProps = Pick<Employee, "name"> & {
  notesCount: number;
  onPress?: () => void;
};

const EmployeeCard = ({ name, notesCount, onPress }: EmployeeCardProps) => (
  <Pressable onPress={onPress} style={styles.container}>
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.info}>
        {notesCount} {notesCount === 1 ? "nota" : "notas"}
      </Text>
    </View>
    <Ionicons name="chevron-forward" color={colors.textSecondary} size={20} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
});

export default EmployeeCard;
