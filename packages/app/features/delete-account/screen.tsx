import { Button, Paragraph, YStack, useToastController, Text } from '@t4/ui';
import { useRouter } from 'solito/router';
import { deleteUser, useUser } from 'app/utils/supabase/auth';
import { isExpoGo } from 'app/utils/flags';
import { useEffect } from 'react';

export function DeleteAccountScreen() {
  const { push } = useRouter()
  const { user, loading } = useUser();
  const toast = useToastController()

  useEffect(()=>{
    if(!loading && !user){
      push("/")
    }
  }, [user, loading])

  if(loading || !user) return null

  const handleAccountDeletion = async () => {
    const { error } = await deleteUser(user.id)

    if (error) {
        if (!isExpoGo) {
          toast.show('Account deletion failed', {
            description: error.message,
          })
        }
        console.log('Account deletion failed', error)
        return
    }

    push("/")
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
        <Paragraph size="$5" fontWeight="700" opacity={0.8} marginBottom="$1">
            Delete your Account
        </Paragraph>

        <Paragraph size="$3" marginBottom="$1" px="$1">
            You are about to delete your <Text fontWeight="700">t4-app</Text> account associated with <Text fontWeight="700">{user.email}</Text>, if you press the button below all of your data will be erased from our servers immediately.
        </Paragraph>

        <Button
            themeInverse
            onPress={handleAccountDeletion}
            hoverStyle={{ opacity: 0.8 }}
            onHoverIn={() => {}}
            onHoverOut={() => {}}
            focusStyle={{ scale: 0.975 }}
        >
            Delete Account
        </Button>
    </YStack>
  )
}
