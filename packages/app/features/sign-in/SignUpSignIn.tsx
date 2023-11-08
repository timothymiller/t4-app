import { type Provider } from '@supabase/supabase-js'
import { Button, Input, Paragraph, Stack, XStack, YStack } from '@t4/ui'
import { useState } from 'react'
import { SolitoImage } from 'solito/image'
import { Link } from 'solito/link'

interface Props {
  type: 'sign-up' | 'sign-in'
  handleOAuthWithPress: (provider: Provider) => void
  handleEmailWithPress: (email, password) => void
}

export const SignUpSignInComponent = ({
  type,
  handleOAuthWithPress,
  handleEmailWithPress,
}: Props): React.ReactNode => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <YStack
      borderRadius='$10'
      space
      paddingHorizontal='$7'
      paddingVertical='$6'
      width={350}
      shadowColor={'#00000020'}
      shadowRadius={26}
      shadowOffset={{ width: 0, height: 4 }}
      backgroundColor='$background'
    >
      <Paragraph size='$5' fontWeight={'700'} opacity={0.8} marginBottom='$1'>
        {type === 'sign-up' ? 'Create your account' : 'Sign in to your account'}
      </Paragraph>
      {/* all the oauth sign up options */}
      <XStack space justifyContent={'space-evenly'} theme='light'>
        {/* 3 buttons, for google, apple, discord */}
        <Button
          size='$5'
          onPress={() => handleOAuthWithPress('google')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor='$gray8Light'
        >
          <SolitoImage
            style={{ width: 20, height: 20 }}
            src={'/auth/google-logo.png'}
            width={20}
            height={20}
            alt='Google Logo'
          />
        </Button>
        <Button
          size='$5'
          onPress={() => handleOAuthWithPress('apple')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor='$gray8Light'
        >
          <SolitoImage
            style={{ width: 22, height: 22 }}
            src={'/auth/apple-logo.png'}
            width={22}
            height={22}
            alt='Apple Logo'
          />
        </Button>
        <Button
          size='$5'
          onPress={() => handleOAuthWithPress('discord')}
          hoverStyle={{ opacity: 0.8 }}
          focusStyle={{ scale: 0.95 }}
          borderColor='$gray8Light'
        >
          <SolitoImage
            style={{ width: 25, height: 22 }}
            src={'/auth/discord-logo.png'}
            width={20}
            height={20}
            alt='Discord Logo'
          />
        </Button>
      </XStack>
      <XStack alignItems='center' width='100%' justifyContent='space-between'>
        <Stack height='$0.25' backgroundColor='black' width='$10' opacity={0.1} />
        <Paragraph size='$3' opacity={0.5}>
          or
        </Paragraph>
        <Stack height='$0.25' backgroundColor='black' width='$10' opacity={0.1} />
      </XStack>

      {/* email sign up option */}
      <Input
        autoCapitalize='none'
        placeholder='Email'
        onChangeText={(text) => {
          setEmail(text)
        }}
      />
      <Input
        autoCapitalize='none'
        placeholder='Password'
        onChangeText={(text) => {
          setPassword(text)
        }}
        textContentType='password'
        secureTextEntry
      />

      {/* sign up button */}
      <Button
        themeInverse
        onPress={() => {
          handleEmailWithPress(email, password)
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
        <Paragraph size='$2' marginRight='$2' opacity={0.4}>
          {type === 'sign-up' ? 'Already have an account?' : 'Don’t have an account?'}
        </Paragraph>
        <Link href={type === 'sign-up' ? '/sign-in' : '/sign-up'}>
          <Paragraph
            cursor={'pointer'}
            size='$2'
            fontWeight={'700'}
            opacity={0.5}
            hoverStyle={{ opacity: 0.4 }}
          >
            {type === 'sign-up' ? 'Sign in' : 'Sign up'}
          </Paragraph>
        </Link>
      </XStack>

      {/* forgot password */}
      {type === 'sign-in' && (
        <XStack marginTop='$-2.5'>
          <Paragraph size='$2' marginRight='$2' opacity={0.4}>
            Forgot your password?
          </Paragraph>
          <Link href='/password-reset'>
            <Paragraph
              cursor={'pointer'}
              size='$2'
              fontWeight={'700'}
              opacity={0.5}
              hoverStyle={{ opacity: 0.4 }}
            >
              Reset it
            </Paragraph>
          </Link>
        </XStack>
      )}
    </YStack>
  )
}
