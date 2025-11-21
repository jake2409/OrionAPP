# Orion – WorkNotes Chat

Aplicativo mobile desenvolvido em React Native (Expo) e TypeScript para registrar conversas sobre colaboradores, salvar notas locais com AsyncStorage e visualizar insights rápidos sobre o time.

## Recursos principais

- **Chat Pedrão**: mensagens 100% offline, cada envio já fica persistido no AsyncStorage.
- **Funcionários + notas**: associe mensagens a colaboradores existentes ou crie novos diretamente pelo modal do chat.
- **Detalhes do colaborador**: renomeie pessoas, veja todas as notas vinculadas e remova entradas antigas.
- **Orion Insights**: painel com métricas, ranking de colaboradores e últimas mensagens — tudo animado com Lottie.
- **Design temático**: paleta escura com verdes/azuis, gradientes e componentes reutilizáveis (MessageBubble, EmployeeCard, etc.).

## Pré-requisitos

- Node.js 18+
- npm ≥ 9 (ou Yarn, se preferir)
- Expo CLI opcional (`npm install -g expo-cli`)

## Como rodar o projeto

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Inicie o bundler**
   ```bash
   npm start
   ```

3. **Escolha onde testar**
   - Pressione `i` para abrir no iOS Simulator (macOS obrigatório).
   - Pressione `a` para o Android Emulator.
   - Escaneie o QR code com o app **Expo Go** no celular.

> Preferindo Yarn, utilize `yarn` e `yarn start`.

## Estrutura resumida

```
src/
 ├─ components/         // Header, MessageBubble, EmployeeCard...
 ├─ context/DataContext // Estado global + AsyncStorage
 ├─ navigation/         // Stack do React Navigation
 ├─ screens/            // Chat, Employees, EmployeeDetail, Insights
 ├─ storage/            // Serviços de persistência
 └─ theme/              // Paleta e tokens visuais
```

## Scripts úteis

| Comando        | Descrição                                |
| -------------- | ---------------------------------------- |
| `npm start`    | Inicia o Metro bundler (`expo start`).    |
| `npm run lint` | Executa o ESLint com a config do Expo.    |

## Observações

- O app é totalmente local — sem backend ou APIs externas.
- Para limpar os dados salvos, basta remover o app/limpar o cache do Expo/AsyncStorage.
- Use `npx expo install <pacote>` para garantir versões compatíveis com o SDK 54.

Bom estudo e bons registros com o Orion! 🚀
