import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router'


const Home = () => {
  const { user } = useUser()
  
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      
        <SignedIn>
          <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        </SignedIn>
      
    </SafeAreaView>
  );
}

export default Home;