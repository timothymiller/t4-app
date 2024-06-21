import * as v from 'valibot'

const EmailSchema = v.pipe(
  v.string('The email address is badly formatted.'),
  v.email('The email address is badly formatted.'),
  v.nonEmpty('Please enter your email.')
)
export type EmailInput = v.InferInput<typeof EmailSchema>
export type EmailOutput = v.InferOutput<typeof EmailSchema>

const PasswordSchema = v.pipe(
  v.string('Your password must be a string.'),
  v.nonEmpty('Please enter your password.'),
  v.minLength(8, 'Your password must have 8 characters or more.')
)
export type PasswordInput = v.InferInput<typeof PasswordSchema>
export type PasswordOutput = v.InferOutput<typeof PasswordSchema>

const NumberSchema = v.pipe(
  v.string('Please enter a value.'),
  v.custom((input) => {
    if (!/^\d+(\.\d+)?$/.test(input)) {
      return 'Please enter a valid number.'
    }
    return input
  }),
  v.transform((input) => Number(input)),
  v.number('Please enter a valid number.'),
  v.minValue(1, 'Your number must be greater than 0.')
)

export type NumberInput = v.InferInput<typeof NumberSchema>
export type NumberOutput = v.InferOutput<typeof NumberSchema>

const SelectSchema = v.string('Please select an option.')
export type SelectInput = v.InferInput<typeof SelectSchema>
export type SelectOutput = v.InferOutput<typeof SelectSchema>

const StringSchema = v.pipe(
  v.string('Input must be a string.'),
  v.maxLength(500, 'Input must be no more than 500 characters.')
)
export type StringInput = v.InferInput<typeof StringSchema>
export type StringOutput = v.InferOutput<typeof StringSchema>

const TextAreaSchema = v.pipe(
  v.string('Input must be a string.'),
  v.maxLength(5000, 'Input must be no more than 5000 characters.')
)
export type TextAreaInput = v.InferInput<typeof TextAreaSchema>
export type TextAreaOutput = v.InferOutput<typeof TextAreaSchema>

const SliderSchema = v.pipe(
  v.number('Please provide a response.'),
  v.minValue(0, 'Your number must be greater than 0.'),
  v.maxValue(100, 'Your number must be less than or equal to 100.')
)
export type SliderInput = v.InferInput<typeof SliderSchema>
export type SliderOutput = v.InferOutput<typeof SliderSchema>

const SwitchSchema = v.pipe(
  v.any(),
  v.transform((input) => {
    console.log('switchSchema', { input })
    if (!input || input === undefined) {
      return Boolean(false)
    }
    return Boolean(input)
  }),
  v.boolean('Please enter a valid boolean.')
)

export type SwitchInput = v.InferInput<typeof SwitchSchema>
export type SwitchOutput = v.InferOutput<typeof SwitchSchema>

const ToggleGroupSchema = v.pipe(
  v.any(),
  v.transform((input) => {
    console.log({ input })
    if (!input || input === undefined) {
      return []
    }
    return input
  }),
  v.array(v.string('Please select an option.')),
  v.minLength(1, 'Please select at least one option.')
)

export type ToggleGroupInput = v.InferInput<typeof ToggleGroupSchema>
export type ToggleGroupOutput = v.InferOutput<typeof ToggleGroupSchema>

export const inputPresets = {
  password: {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    schema: PasswordSchema,
  },
  email: {
    name: 'email',
    placeholder: 'Email',
    type: 'email',
    schema: EmailSchema,
  },
  number: {
    name: 'number',
    placeholder: 'Number',
    type: 'number',
    schema: NumberSchema,
  },
  select: {
    name: 'select',
    placeholder: 'Select',
    type: 'select',
    schema: SelectSchema,
  },
  string: {
    name: 'string',
    placeholder: '',
    type: 'text',
    schema: StringSchema,
  },
  textArea: {
    name: 'textArea',
    placeholder: '',
    type: 'textArea',
    schema: TextAreaSchema,
  },
  slider: {
    name: 'slider',
    placeholder: '',
    type: 'slider',
    schema: SliderSchema,
  },
  switch: {
    name: 'switch',
    placeholder: '',
    type: 'switch',
    schema: SwitchSchema,
  },
  radioGroup: {
    name: 'radioGroup',
    placeholder: '',
    type: 'radioGroup',
    schema: SelectSchema,
  },
  toggleGroup: {
    name: 'toggleGroup',
    placeholder: '',
    type: 'toggleGroup',
    schema: { single: SelectSchema, multiple: ToggleGroupSchema },
  },
}

export type InputPreset = keyof typeof inputPresets
export const getInputPreset = (preset: InputPreset) => inputPresets[preset]
