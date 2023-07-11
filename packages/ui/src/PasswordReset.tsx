import { useState } from 'react'
import { YStack, Paragraph, Button, Input } from 'tamagui'

interface Props {
  type: 'email' | 'password'
  handleWithPress: (emailOrPassword) => void
}

export const PasswordResetComponent: React.FC<Props> = ({ type, handleWithPress }) => {
  const [emailOrPassword, setEmailOrPassword] = useState('')

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
        {type == 'email' ? 'Reset your password' : 'Change your password'}
      </Paragraph>

      {/* email or password input */}

      {type === 'email' ? (
        <Input
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={(text) => {
            setEmailOrPassword(text)
          }}
        />
      ) : (
        <Input
          autoCapitalize="none"
          placeholder="New Password"
          onChangeText={(text) => {
            setEmailOrPassword(text)
          }}
          textContentType="password"
          secureTextEntry
        />
      )}

      {/* reset password button */}
      <Button
        themeInverse
        onPress={() => {
          handleWithPress(emailOrPassword)
        }}
        hoverStyle={{ opacity: 0.8 }}
        onHoverIn={() => {}}
        onHoverOut={() => {}}
        focusStyle={{ scale: 0.975 }}
      >
        {type == 'email' ? 'Reset Password' : 'Change Password'}
      </Button>
    </YStack>
  )
}
