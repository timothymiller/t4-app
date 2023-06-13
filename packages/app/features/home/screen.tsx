import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  XStack,
  YStack,
  useToastController,
} from '@t4/ui'
import { ChevronDown } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { Linking } from 'react-native'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth } from '../../utils/clerk'
import Constants from 'expo-constants'
import { useSheetOpen } from '@t4/ui/src/atoms/sheet'
import { SolitoImage } from 'solito/image'

export function HomeScreen() {
  const { signOut } = useAuth()

  const signInLink = useLink({
    href: '/sign-in',
  })

  const signUpLink = useLink({
    href: '/sign-up',
  })

  const dataFetchingLink = useLink({
    href: '/data-fetching',
  })

  const infiniteListLink = useLink({
    href: '/infinite-list',
  })

  const paramsLink = useLink({
    href: '/params/tim',
  })

  return (
    <ScrollView>
      <YStack f={1} jc="center" ai="center" p="$4" space="$4">
        <SolitoImage src="/t4-logo.png" width={128} height={128} alt="T4 Logo" />
        <H1 textAlign="center">👋 Hello, T4 App</H1>
        <Separator />
        <Paragraph textAlign="center" size={'$2'}>
          Unifying React Native + Web.
        </Paragraph>
        <Paragraph textAlign="center" size={'$2'}>
          The T4 Stack is made by{' '}
          <Anchor href="https://twitter.com/ogtimothymiller" target="_blank">
            Tim Miller
          </Anchor>
          , give it a star{' '}
          <Anchor href="https://github.com/timothymiller/t4-app" target="_blank" rel="noreferrer">
            on Github.
          </Anchor>
        </Paragraph>

        <Button onPress={() => Linking.openURL('https://t4stack.com/')}>Learn More...</Button>

        <H3>🦮🐴 App Demos</H3>
        <YStack space="$2">
          <Button {...infiniteListLink} space="$2">
            Infinite List
          </Button>
          <Button {...dataFetchingLink} space="$2">
            Fetching Data
          </Button>
          <Button {...paramsLink} space="$2">
            Params
          </Button>
          <SheetDemo />
        </YStack>
        <SignedIn>
          <Button
            onPress={() => {
              signOut()
            }}
            space="$2"
          >
            Sign Out
          </Button>
        </SignedIn>
        <SignedOut>
          <XStack space="$2">
            <Button {...signInLink} space="$2">
              Sign In
            </Button>
            <Button {...signUpLink} space="$2">
              Sign Up
            </Button>
          </XStack>
        </SignedOut>
      </YStack>
    </ScrollView>
  )
}

function SheetDemo() {
  const [open, setOpen] = useSheetOpen()
  const [position, setPosition] = useState(0)
  const toast = useToastController()

  return (
    <>
      <Button onPress={() => setOpen((x) => !x)} space="$2">
        Bottom Sheet
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              const isExpoGo = Constants.appOwnership === 'expo'
              if (!isExpoGo) {
                toast.show('Sheet closed!', {
                  message: 'Just showing how toast works...',
                })
              }
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
