import { useState } from 'react'
import { Button, Input, Paragraph, YStack } from 'tamagui'

interface Props {
  type: 'email' | 'password'
  handleWithPress: (emailOrPassword: string) => void
}

export const PasswordResetComponent: React.FC<Props> = ({ type, handleWithPress }) => {
  const [emailOrPassword, setEmailOrPassword] = useState('')

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
        {type === 'email' ? 'Reset your password' : 'Change your password'}
      </Paragraph>

      {/* email or password input */}
      {type === 'email' ? (
        <Input
          autoCapitalize='none'
          placeholder='Email'
          onChangeText={(text) => {
            setEmailOrPassword(text)
          }}
        />
      ) : (
        <Input
          autoCapitalize='none'
          placeholder='New Password'
          onChangeText={(text) => {
            setEmailOrPassword(text)
          }}
          textContentType='password'
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
        {type === 'email' ? 'Reset Password' : 'Change Password'}
      </Button>
    </YStack>
  )
}
