import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, View, Alert, ScrollView, Image } from 'react-native'
import React, { useState, useCallback } from 'react'
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from '@/components/OAuth';

import { useAuth } from "@clerk/clerk-expo";


export default function SignIn() {

  const { signOut } = useAuth(); //delete after session ended

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(root)/(tabs)/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            onChangeText={(pass) => setPassword(pass)}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}

{/*<ScrollView className="flex-1 bg-white">
          <View className="flex-1 bg-white">
            <View className="relative w-full h-[250px]">
              <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
              <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                Create Your Account
              </Text>
            </View>

    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <InputField
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
      />
      <InputField
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(pass) => setPassword(pass)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
      />
      <Button title="Sign In" onPress={onSignInPress} />

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={{ color: 'blue' }}>Sign Up</Text>
        </Link>
        <Button title="Çıkış Yap" onPress={() => signOut()} />

      </View>
    </View>
    </View>
        </ScrollView>*/}