import * as React from 'react'
import { Image, ScrollView, Text, View, Alert } from 'react-native'
import { ReactNativeModal } from "react-native-modal"
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { fetchAPI } from '@/lib/fetch'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [name, setName] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [verificationStatus, setVerificationStatus] = React.useState(false);
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)

    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })
      
      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await fetchAPI('/(api)/user', {
          method: "POST",
          body: JSON.stringify({
            name: name,
            email: emailAddress,
            clerkId: signUpAttempt.createdUserId
          })
        })

        await setActive({ session: signUpAttempt.createdSessionId })
        setPendingVerification(false)

        setVerificationStatus(true)
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
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
            Create Your Account
          </Text>
        </View>

        
        { /*!pendingVerification && !verificationStatus ? (*/}
          <View className="p-5">
            <InputField
              label="Name"
              placeholder="Enter name"
              icon={icons.person}
              value={name}
              onChangeText={(name) => setName(name)} 
            />

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
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6" 
            />
            <OAuth />
            <Link 
              href="/sign-in"
              className="text-lg text-center text-general-200 mt-10"
             >
              <Text>Already have an account? <Text className="text-primary-500">Log In</Text></Text>
            </Link>
          </View>
        {/*) : null */}
        

          {/* pendingVerification ? (*/}
          <ReactNativeModal
            isVisible={pendingVerification}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
              <Text className="font-Jakarta mb-5">We've sent a verification code to {emailAddress}.</Text>
              <InputField
                label={"Code"}
                icon={icons.lock}
                placeholder={"12345"}
                value={code}
                keyboardType="numeric"
                onChangeText={(code) => setCode(code)}
              />
              
              <CustomButton title="Verify Email" onPress={onVerifyPress} className="mt-5 bg-success-500" />
            </View>
          {/*) : null */}
          </ReactNativeModal>

        { /*verificationStatus ? (*/}
        <ReactNativeModal
          isVisible={verificationStatus}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>

            <CustomButton
              title="Browse Home" 
              onPress={() => {
                router.push('/(root)/(tabs)/home')
              }} 
              className="mt-5" />
          </View>
           {/*) : null */}
        </ReactNativeModal>

      </View>
    </ScrollView>
  )
}