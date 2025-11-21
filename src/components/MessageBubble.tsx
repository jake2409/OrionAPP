import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Message } from "../types/Message";

type MessageBubbleProps = Pick<Message, "text" | "createdAt"> & {
  onSave: () => void;
};

const formatTimestamp = (value: string) => {
  try {
    return new Date(value).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const MessageBubble = ({ text, createdAt, onSave }: MessageBubbleProps) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.text}>{text}</Text>
      <Pressable style={styles.saveButton} onPress={onSave}>
        <Ionicons name="bookmark-outline" size={20} color={colors.secondary} />
      </Pressable>
    </View>
    <Text style={styles.timestamp}>{formatTimestamp(createdAt)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  text: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: colors.muted,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
});

export default MessageBubble;
