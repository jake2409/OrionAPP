import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../types/Message";

const MESSAGE_STORAGE_KEY = "@worknotes/messages";

export const loadMessages = async (): Promise<Message[]> => {
  try {
    const stored = await AsyncStorage.getItem(MESSAGE_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as Message[];
  } catch (error) {
    console.error("Erro ao carregar mensagens", error);
    throw error;
  }
};

export const saveMessages = async (messages: Message[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      MESSAGE_STORAGE_KEY,
      JSON.stringify(messages),
    );
  } catch (error) {
    console.error("Erro ao salvar mensagens", error);
    throw error;
  }
};

