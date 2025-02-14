import { tokenCache } from '@/cache'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import { Text, View, Button } from "react-native";
import { router } from 'expo-router';
import "../global.css"

export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}}/>
          <Stack.Screen name="(auth)" options={{headerShown: false}}/>
          <Stack.Screen name="(root)" options={{ headerShown: false }}/>
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
