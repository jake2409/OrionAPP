import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type HeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

const Header = ({ title, subtitle, action }: HeaderProps) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {action ? <View style={styles.action}>{action}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  action: {
    marginLeft: 12,
  },
});

export default Header;

