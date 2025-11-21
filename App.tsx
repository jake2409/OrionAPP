import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation";
import { DataProvider, useData } from "./src/context/DataContext";
import { colors } from "./src/theme/colors";

const RootNavigation = () => {
  const { loading } = useData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <AppNavigator />;
};

const App = () => (
  <SafeAreaProvider>
    <DataProvider>
      <RootNavigation />
      <StatusBar style="light" />
    </DataProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;

