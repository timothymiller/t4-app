import { useState } from 'react'
import { Image, YStack, Paragraph, XStack, Button, Input, Stack } from 'tamagui'
import { Link } from 'solito/link'
// import { OAuthStrategy } from '@clerk/types'

interface Props {
  type: 'sign-up' | 'sign-in'
  // handleOAuthWithPress: (strategy: OAuthStrategy) => void
  handleEmailWithPress: (emailAddress, password) => void
}

export const SignUpSignInComponent: React.FC<Props> = ({
  type,
  // handleOAuthWithPress,
  handleEmailWithPress,
}) => {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  return (
    <YStack
      borderRadius="$10"
      space
      px="$7"
      py="$6"
      w={350}
      shadowColor={'#00000020'}
      shadowRadius={26}
      shadowOffset={{ width: 0, height: 4 }}
      bg="$background"
    >
      <Paragraph size="$5" fontWeight={'700'} opacity={0.8} mb="$1">
        {type === 'sign-up' ? 'Create your account' : 'Log in to your account'}
      </Paragraph>
      {/* all the oauth sign up options */}
      <XStack space jc={'space-evenly'} theme="light">
        {/* 3 buttons, for google, apple, discord */}
        <Button
          size="$5"
          // onPress={() => handleOAuthWithPress('oauth_google')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor="$gray8Light"
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={{ width: 20, height: 20, uri: 'auth/google-logo.png' }}
            width="100%"
            height="100%"
            resizeMode="contain"
            alt="Google Logo"
          />
        </Button>
        <Button
          size="$5"
          // onPress={() => handleOAuthWithPress('oauth_apple')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor="$gray8Light"
        >
          <Image
            style={{ width: 22, height: 22 }}
            source={{ width: 22, height: 22, uri: 'auth/apple-logo.png' }}
            width="100%"
            height="100%"
            resizeMode="contain"
            alt="Apple Logo"
          />
        </Button>
        <Button
          size="$5"
          // onPress={() => handleOAuthWithPress('oauth_discord')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor="$gray8Light"
        >
          <Image
            style={{ width: 25, height: 22 }}
            source={{ width: 25, height: 22, uri: 'auth/discord-logo.png' }}
            width="100%"
            height="100%"
            resizeMode="contain"
            alt="Discord Logo"
          />
        </Button>
      </XStack>
      <XStack ai="center" width="100%" jc="space-between">
        <Stack h="$0.25" bg="black" w="$10" opacity={0.1} />
        <Paragraph size="$3" opacity={0.5}>
          or
        </Paragraph>
        <Stack h="$0.25" bg="black" w="$10" opacity={0.1} />
      </XStack>

      {/* email sign up option */}
      <Input
        placeholder="Email"
        onChangeText={(text) => {
          setEmailAddress(text)
        }}
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => {
          setPassword(text)
        }}
        textContentType="password"
        secureTextEntry
      />

      {/* sign up button */}
      <Button
        themeInverse
        onPress={() => {
          handleEmailWithPress(emailAddress, password)
        }}
        hoverStyle={{ opacity: 0.8 }}
        onHoverIn={() => {}}
        onHoverOut={() => {}}
        focusStyle={{ scale: 0.975 }}
      >
        {type === 'sign-up' ? 'Sign up' : 'Sign in'}
      </Button>

      {/* or sign in, in small and less opaque font */}
      <XStack>
        <Paragraph size="$2" mr="$2" opacity={0.4}>
          {type === 'sign-up' ? 'Already have an account?' : 'Don’t have an account?'}
        </Paragraph>
        <Link href={type === 'sign-up' ? '/sign-in' : '/sign-up'}>
          <Paragraph
            cursor={'pointer'}
            size="$2"
            fontWeight={'700'}
            opacity={0.5}
            hoverStyle={{ opacity: 0.4 }}
          >
            {type === 'sign-up' ? 'Sign in' : 'Sign up'}
          </Paragraph>
        </Link>
      </XStack>
    </YStack>
  )
}
