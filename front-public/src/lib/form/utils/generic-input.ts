import TextInput from '@/lib/form/components/text/text-input.component';
import TextAreaInput from '@/lib/form/components/textarea/textarea.component';
import { ExtractExoticComponentProps } from '@/lib/types/utility/react';
import React from 'react';

const inputNamesToComponent = {
  // checkbox: CheckBoxInput,
  // datepicker: DatePickerInput,
  // hidden: HiddenInput,
  // multiselect: MultiSelectInput,
  // number: NumberInput,
  // password: PasswordInput,
  // radio: RadioInput,
  // radiosingle: RadioSingleInput,
  // rte: RteInput,
  // select: SelectInput,
  // switch: SwitchInput,
  textarea: TextAreaInput,
  text: TextInput,
} as const;

export const inputDefaultValues = {
  // checkbox: false,
  // datepicker: null,
  // multiselect: [],
  // number: '',
  // password: '',
  // radio: undefined,
  // hidden: '',
  // radiosingle: undefined,
  // rte: '',
  // select: '',
  // switch: false,
  text: '',
  textarea: '',
} satisfies { [P in keyof InputNamesToProps]: InputNamesToProps[P]['value'] };

export type InputNamesToProps = {
  [InputName in keyof typeof inputNamesToComponent]: ExtractExoticComponentProps<(typeof inputNamesToComponent)[InputName]>;
};

export function renderGenericInput<K extends keyof InputNamesToProps>(type: K, props: InputNamesToProps[K]) {
  return React.createElement(inputNamesToComponent[type] as React.ForwardRefExoticComponent<InputNamesToProps[K]>, props);
}
