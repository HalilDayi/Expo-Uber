import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
  
const Layout = () => {
  return(
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen name="find-ride" options={{headerShown: false}}/>
      <Stack.Screen name="confirm-ride" options={{headerShown: false}}/>
      <Stack.Screen name="book-ride" options={{headerShown: false}}/>
    </Stack>
  );
}

export default Layout;