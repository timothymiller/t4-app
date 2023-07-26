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
import React, { useRef, useEffect } from 'react'
import { Linking } from 'react-native'
import { useLink } from 'solito/link'
import { isUserSignedIn, signOut } from 'app/utils/supabase'
import Constants from 'expo-constants'
import { SolitoImage } from 'solito/image'
import { useObservable, reactive } from '@legendapp/state/react'

export function HomeScreen() {
  const state = useObservable({ count: 0, isSignedIn: false })

  useEffect(() => {
    const fetchSignedInStatus = async () => {
      const signedInStatus = await isUserSignedIn()
      state.isSignedIn.set(signedInStatus)
    }

    fetchSignedInStatus()
  }, [])

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

  // TODO: delete count example before merging legend state PR
  const renderCount = ++useRef(0).current

  setInterval(() => {
    state.count.set((v) => v + 1)
  }, 2000)

  return (
    <ScrollView>
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$4">
        <SolitoImage src="/t4-logo.png" width={128} height={128} alt="T4 Logo" />
        <H1>Renders: {renderCount}</H1>
        <H1>Count: {state.count}</H1>
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
        <Paragraph textAlign="center" size={'$2'}>
          Tamagui is made by{' '}
          <Anchor href="https://twitter.com/natebirdman" target="_blank">
            Nate Weinert
          </Anchor>
          , give it a star{' '}
          <Anchor href="https://github.com/tamagui/tamagui" target="_blank" rel="noreferrer">
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
        {state.isSignedIn.get() ? (
          <Button
            onPress={async () => {
              state.isSignedIn.set(false)
              await signOut()
            }}
            space="$2"
          >
            Sign Out
          </Button>
        ) : (
          <XStack space="$2">
            <Button {...signInLink} space="$2">
              Sign In
            </Button>
            <Button {...signUpLink} space="$2">
              Sign Up
            </Button>
          </XStack>
        )}
      </YStack>
    </ScrollView>
  )
}

const ReactiveSheet = reactive(Sheet)
const ReactiveSheetOverlay = reactive(Sheet.Overlay)
const ReactiveSheetFrame = reactive(Sheet.Frame)
function SheetDemo() {
  const state = useObservable({ sheetOpen: false, position: 0 })

  const { sheetOpen, position } = state

  const toast = useToastController()

  const handlePress = () => {
    sheetOpen.set(true)
  }
  return (
    <>
      <Button onPress={() => handlePress()} space="$2">
        Bottom Sheet
      </Button>
      <ReactiveSheet
        modal
        $open={sheetOpen.get}
        onOpenChange={sheetOpen.set}
        snapPoints={[80]}
        position={position.get()}
        onPositionChange={position.set}
        dismissOnSnapToBottom
      >
        <ReactiveSheetOverlay />
        <ReactiveSheetFrame alignItems="center" justifyContent="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              sheetOpen.set(false)
              const isExpoGo = Constants.appOwnership === 'expo'
              if (!isExpoGo) {
                toast.show('Sheet closed!', {
                  message: 'Just showing how toast works...',
                })
              }
            }}
          />
        </ReactiveSheetFrame>
      </ReactiveSheet>
    </>
  )
}
