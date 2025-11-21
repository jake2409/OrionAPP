import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "./types";

export const useAppNavigation = () => useNavigation<AppNavigationProp>();

