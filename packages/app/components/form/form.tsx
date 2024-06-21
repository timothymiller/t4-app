import React from 'react'
import {
  YStack,
  Text,
  Button,
  InputProps,
  TextProps,
  StackProps,
  useTheme,
  YStackProps,
} from 'tamagui'
import { observable, computed, batch, when } from '@legendapp/state'
import { useObservable } from '@legendapp/state/react'
import { AnySchema, safeParse } from 'valibot'
import StyledInput from './StyledInput'
import { getInputPreset, InputPreset } from './inputPresets'
import * as v from 'valibot'

interface CustomInputConfig {
  name: string
  placeholder?: string
  type?: string
  schema: AnySchema
  labelText?: string
  options?: { id: number; value: string }[]
  id?: string
  size?: string
  defaultChecked?: boolean
  style?: object
  optional?: boolean
  multiple?: boolean
}

interface PresetInputConfig {
  name: string
  preset: InputPreset
  labelText?: string
  placeholder?: string
  options?: { id: number; value: string }[]
  id?: string
  size?: string
  defaultChecked?: boolean
  style?: object
  optional?: boolean
  multiple?: boolean
}

type InputType =
  | 'text'
  | 'number'
  | 'select'
  | 'switch'
  | 'radioGroup'
  | 'toggleGroup'
  | 'textBox'
  | 'slider'

interface InputBase {
  name: string
  labelText: string
  placeholder?: string
  type?: InputType
  options?: { id: number; value: string }[]
  style?: object
  optional?: boolean
}

interface StringInput extends InputBase {
  preset: 'string'
  schema?: v.AnySchema
}

interface NumberInput extends InputBase {
  preset: 'number'
  schema?: v.AnySchema
}

interface SelectInput extends InputBase {
  preset: 'select'
  schema?: v.AnySchema
}

interface SwitchInput extends InputBase {
  preset: 'switch'
  style?: { size?: string; defaultChecked?: boolean }
}

interface RadioGroupInput extends InputBase {
  preset: 'radioGroup'
  options: { id: number; value: string }[]
}

interface ToggleGroupInput extends InputBase {
  preset: 'toggleGroup'
  options: { id: number; value: string }[]
  multiple?: boolean
}

interface TextAreaInput extends InputBase {
  preset: 'textArea'
  schema?: v.AnySchema
  style?: { minHeight?: number }
}

interface SliderInput extends InputBase {
  preset: 'slider'
  schema?: v.AnySchema
  style?: { max?: number; step?: number }
}

export type InputConfig =
  | StringInput
  | NumberInput
  | SelectInput
  | SwitchInput
  | RadioGroupInput
  | ToggleGroupInput
  | TextAreaInput
  | SliderInput

interface FormProps {
  inputsConfig: (PresetInputConfig | CustomInputConfig)[]
  onSubmit: (formData: Record<string, any>) => void
  formContainerStyle?: YStackProps['style']
  inputContainerStyle?: InputProps['style']
  inputStyle?: InputProps['style']
  inputLabelStyle?: TextProps['style']
  inputErrorStyle?: TextProps['style']
  customButton?: JSX.Element | null
  submitTrigger$: any
  showSubmit?: boolean
  autoSubmit?: boolean
}

const Form = ({
  inputsConfig,
  onSubmit,
  formContainerStyle,
  inputContainerStyle,
  inputStyle,
  inputLabelStyle,
  inputErrorStyle,
  customButton,
  submitTrigger$,
  showSubmit = true,
  autoSubmit = false,
}: FormProps) => {
  const tamaguiTheme = useTheme()

  const values$ = useObservable({})
  const errors$ = useObservable({})
  const focusStates$ = useObservable({})
  const touched$ = useObservable({})
  const didSubmit$ = useObservable(false)
  const formError$ = useObservable('')

  const defaultFormContainerStyle: StackProps['style'] = {
    padding: 15,
    gap: 15,
    backgroundColor: tamaguiTheme.background.val,
  }

  // Utility to get full config
  const getConfig = (input) =>
    'preset' in input
      ? {
          ...getInputPreset(input.preset),
          name: input.name,
          labelText: input.labelText,
          placeholder: input.placeholder,
          options: input.options,
          id: input.name,
          size: input.size,
          defaultChecked: input.defaultChecked,
          style: input.style,
          optional: input.optional,
          multiple: input.multiple,
        }
      : input

  inputsConfig.forEach((input) => {
    const config = getConfig(input)
    if (!values$[config.name]) values$[config.name] = useObservable('')
    if (!errors$[config.name]) errors$[config.name] = useObservable('')
    if (!focusStates$[config.name]) focusStates$[config.name] = useObservable(false)
    if (!touched$[config.name]) touched$[config.name] = useObservable(false)
  })

  const validateInput = (name: string) => {
    const inputConfig = inputsConfig.find((input) => input.name === name)
    if (inputConfig) {
      const config = getConfig(inputConfig)
      let schema

      if (config.type === 'toggleGroup') {
        schema = config.multiple
          ? config.optional
            ? v.optional(config.schema['multiple'])
            : config.schema['multiple']
          : config.optional
          ? v.optional(config.schema['single'])
          : config.schema['single']
      } else {
        schema = config.optional ? v.optional(config.schema) : config.schema
      }

      const result = safeParse(schema, values$[name].get())
      errors$[name].set(result.success ? '' : result.issues[0]?.message || 'Validation failed')
    }
  }

  const isFieldValid = (name: string) => {
    validateInput(name)
    return !errors$[name].get()
  }

  const updateFormError = () => {
    const hasErrors = inputsConfig.some((input) => errors$[getConfig(input).name].get())
    formError$.set(hasErrors ? 'Please check the form for errors.' : '')
  }

  const handleSubmit = () => {
    console.log('starting handleSubmit')
    didSubmit$.set(true)
    let formIsValid = true

    inputsConfig.forEach((input) => {
      const config = getConfig(input)
      validateInput(config.name)
      if (errors$[config.name].get()) {
        formIsValid = false
      }
    })

    if (formIsValid) {
      const formData = inputsConfig.reduce((acc, input) => {
        const config = getConfig(input)
        let value = values$[config.name].get()
        if (config.type === 'number' || config.type === 'slider') {
          value = Number(value)
        }
        acc[config.name] = value
        return acc
      }, {})
      onSubmit(formData)
    } else {
      updateFormError()
    }
    didSubmit$.set(false)
    submitTrigger$.set(false)
  }

  when(() => submitTrigger$.get(), handleSubmit)

  const allFieldsValidAndTouched$ = computed(() => {
    return inputsConfig.every((input) => {
      const config = getConfig(input)
      return touched$[config.name].get() && isFieldValid(config.name)
    })
  })

  const anyFieldHasFocus$ = computed(() => {
    return inputsConfig.some((input) => focusStates$[getConfig(input).name].get())
  })

  when(
    () => autoSubmit && allFieldsValidAndTouched$.get() && !anyFieldHasFocus$.get(),
    handleSubmit
  )

  const handleBlur = (name: string) => {
    validateInput(name)
    touched$[name].set(true)
    updateFormError()
    if (autoSubmit && allFieldsValidAndTouched$.get() && !anyFieldHasFocus$.get()) {
      handleSubmit()
    }
  }

  const handleChange = (name: string) => {
    validateInput(name)
    touched$[name].set(true)
    updateFormError()
    if (autoSubmit && allFieldsValidAndTouched$.get() && !anyFieldHasFocus$.get()) {
      handleSubmit()
    }
  }

  return (
    <YStack {...defaultFormContainerStyle} {...formContainerStyle}>
      {formError$.get() && <Text>{formError$.get()}</Text>}
      {inputsConfig.map((input) => {
        const config = getConfig(input)
        return (
          <YStack key={config.name} style={inputContainerStyle}>
            <StyledInput
              key={config.name}
              value$={values$[config.name]}
              error$={errors$[config.name]}
              placeholder={config.placeholder}
              type={config.type}
              validateOnBlur={(value) => {
                validateInput(config.name)
                const error = errors$[config.name].get() || ''
                updateFormError()
                return error
              }}
              inputStyle={inputStyle}
              inputLabelStyle={inputLabelStyle}
              inputErrorStyle={inputErrorStyle}
              labelText={config.labelText}
              onFocus={() => {
                focusStates$[config.name].set(true)
                touched$[config.name].set(true)
              }}
              onBlur={() => {
                focusStates$[config.name].set(false)
                handleBlur(config.name)
              }}
              onChange={() => handleChange(config.name)}
              options={config.options}
              id={config.name}
              size={config.size}
              defaultChecked={config.defaultChecked}
              style={config.style}
              multiple={config.multiple}
            />
          </YStack>
        )
      })}
      {showSubmit && customButton === undefined && (
        <Button onPress={() => submitTrigger$.set(true)}>Submit</Button>
      )}
      {customButton !== undefined && customButton}
    </YStack>
  )
}

export default Form
