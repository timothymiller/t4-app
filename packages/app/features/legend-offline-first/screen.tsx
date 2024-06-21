import { observer } from '@legendapp/state/react'
import { observable } from '@legendapp/state'
import { Button, H1, H2, Paragraph, XStack, YStack } from '@t4/ui'
import { cars$ } from 'app/stores/carStore'
import React from 'react'
import { For } from '@legendapp/state/react'
import { createId } from '@paralleldrive/cuid2'
import { SolitoImage } from 'solito/image'
import { formatNumber, formatPrice } from '@t4/ui/src/libs/number'
import type { Car } from '@t4/api/src/db/schema'
import Form, { InputConfig } from 'app/components/form/form'
import { X } from '@tamagui/lucide-icons'

type PartialCar = Partial<Car>

const inputsConfig: InputConfig[] = [
  { name: 'make', preset: 'string', labelText: 'Make', placeholder: 'Make' },
  { name: 'model', preset: 'string', labelText: 'Model', placeholder: 'Model' },
  { name: 'year', preset: 'number', labelText: 'Year', placeholder: 'Year' },
  { name: 'color', preset: 'string', labelText: 'Color', placeholder: 'Color' },
  { name: 'price', preset: 'number', labelText: 'Price', placeholder: 'Price' },
  { name: 'mileage', preset: 'number', labelText: 'Mileage', placeholder: 'Mileage' },
  {
    name: 'fuelType',
    preset: 'radioGroup',
    labelText: 'Fuel Type',
    options: ['Gasoline', 'Diesel', 'Electric'].map((value, id) => ({ id, value })),
  },
  {
    name: 'transmission',
    preset: 'radioGroup',
    labelText: 'Transmission',
    options: ['Automatic', 'Manual'].map((value, id) => ({ id, value })),
  },
  // { name: 'accepted', preset: 'switch', labelText: 'Accepted' },
  // {
  //   name: 'carType',
  //   preset: 'select',
  //   labelText: 'Car Type',
  //   placeholder: 'Select Car Type',
  //   options: ['SUV', 'Sedan'].map((value, id) => ({ id, value })),
  //   optional: true,
  // },
  // {
  //   name: 'driveType',
  //   preset: 'radioGroup',
  //   labelText: 'Drive Type',
  //   options: ['AWD', 'FWD', 'RWD'].map((value, id) => ({ id, value })),
  //   optional: true,
  // },
  // {
  //   name: 'features',
  //   preset: 'toggleGroup',
  //   labelText: 'Features',
  //   options: ['Sunroof', 'Leather Seats', 'Bluetooth'].map((value, id) => ({ id, value })),
  //   //optional: true,
  //   multiple: true,
  // },
  // {
  //   name: 'description',
  //   preset: 'textArea',
  //   labelText: 'Description',
  //   placeholder: 'Enter description',
  //   style: { minHeight: 400 },
  //   optional: true,
  // },
  // { name: 'rating', preset: 'slider', labelText: 'Rating', style: { max: 100, step: 1 } },
]

const formContainerStyle = {
  padding: 20,
  backgroundColor: '#f0f0f0',
}
const inputContainerStyle = { marginBottom: 20 }
const inputStyle = { borderColor: 'green', borderWidth: 3, padding: 15, color: 'purple' }
const inputLabelStyle = { color: 'blue' }
const inputErrorStyle = { color: 'orange' }

export const LegendOfflineFirstScreen = observer((): React.ReactNode => {
  const carsList = cars$.get()
  console.log('carsList', carsList)

  function createCar(car: PartialCar) {
    console.log('createCar', car)
    car.id = createId()
    console.log('car with id', car)
    cars$[car.id].set(car)
  }

  function updateCar() {
    const firstItem = Object.values(carsList)[0]
    if (firstItem) {
      cars$[firstItem.id].set({
        ...firstItem,
        year: firstItem.year + 1,
        //createdAt: '2024-01-01T00:00:00.000Z',
      })
    }
  }

  function clearAllCar() {
    console.log('clearAllCar')
    cars$.set({})
  }

  const submitTrigger$ = observable(false)

  const handleFormSubmit = (formData) => {
    console.log('Form Submitted:', formData)
    createCar(formData)
  }

  const handleCustomSubmit = () => {
    console.log('Custom submit button clicked')
    submitTrigger$.set(true)
  }

  return (
    <YStack>
      <H1>Cars</H1>
      <For each={cars$}>
        {(car) => {
          const { id, make, model, color, year, mileage, price } = car.get()
          return (
            <YStack
              flexDirection='row'
              paddingLeft='$2'
              onPress={() => {
                console.log('delete', id)
                cars$[id].delete()
              }}
              width={400}
              flex={1}
            >
              <SolitoImage
                src='/t4-logo.png'
                width={56}
                height={56}
                alt='T4 Logo'
                style={{ marginTop: 8 }}
              />
              <YStack>
                <Paragraph paddingTop='$2' paddingLeft='$3' paddingBottom='$1' fontSize={16}>
                  {`${make} ${model}`}
                </Paragraph>
                <Paragraph paddingLeft='$3' fontSize={16} opacity={0.6}>
                  {`${color} - ${year} - ${formatNumber(mileage)} miles - ${formatPrice(price)}`}
                </Paragraph>
              </YStack>
              <X size={22} position='absolute' right={0} top={'50%'} />
            </YStack>
          )
        }}
      </For>
      <YStack marginTop={20} />
      <H2>Add Car</H2>
      <Form
        inputsConfig={inputsConfig}
        onSubmit={handleFormSubmit}
        // formContainerStyle={formContainerStyle}
        // inputContainerStyle={inputContainerStyle}
        // inputStyle={inputStyle}
        // inputLabelStyle={inputLabelStyle}
        // inputErrorStyle={inputErrorStyle}
        submitTrigger$={submitTrigger$}
        //showSubmit={false}
        //autoSubmit={false}
      />
      {/* <Button onPress={handleCustomSubmit}>Custom Submit</Button> */}
      <H2 onPress={updateCar}>Update Car</H2>
      <H2 onPress={clearAllCar}>Clear All Cars</H2>
    </YStack>
  )
})
