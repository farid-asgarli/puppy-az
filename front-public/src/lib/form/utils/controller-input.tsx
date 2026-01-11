import { Control, Controller, ControllerProps, ControllerRenderProps, FieldPath, FieldValues, PathValue, UseControllerProps } from 'react-hook-form';
import { InputNamesToProps, inputDefaultValues, renderGenericInput } from './generic-input';
import { merge } from '@/lib/utils/merge';

type ControlledInputNameToProps<K extends keyof InputNamesToProps> = Omit<InputNamesToProps[K], 'name' | 'disabled'>;

type ControlledInputAdapterProps<TValue> = {
  onChange?: (value: TValue) => TValue;
  value?: (value: TValue) => TValue;
};

export type InputObjectProps = {
  [Type in keyof InputNamesToProps]: {
    type: Type;
    props?: ControlledInputNameToProps<Type>;
    controlProps?: Omit<UseControllerProps, 'name' | 'control'>;
    adapter?: ControlledInputAdapterProps<PathValue<FieldValues, string>>;
  };
}[keyof InputNamesToProps];

export type InputObjectMapping = {
  [key: string]: InputObjectProps;
};

export type RHKInputEntries<M extends InputObjectMapping> = {
  [P in keyof M]: any;
};

function resolveAdapter<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  field: ControllerRenderProps<TFieldValues, TName>,
  adapterProps: ControlledInputAdapterProps<PathValue<TFieldValues, TName>> | undefined
) {
  if (adapterProps)
    return {
      value: adapterProps?.value ? adapterProps.value(field.value) : field.value,
      onChange: adapterProps?.onChange
        ? function (val: PathValue<TFieldValues, TName>) {
            return field.onChange(adapterProps.onChange?.(val));
          }
        : field.onChange,
    };
}

export function renderControlledInput<
  K extends keyof InputNamesToProps,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  type: K,
  props: ControlledInputNameToProps<K>,
  controllerProps: Omit<ControllerProps<TFieldValues, TName>, 'render'>,
  adapterProps?: ControlledInputAdapterProps<PathValue<TFieldValues, TName>>
) {
  return (
    <Controller
      {...controllerProps}
      key={controllerProps.name}
      defaultValue={controllerProps.defaultValue ?? (inputDefaultValues[type] as PathValue<TFieldValues, TName>)}
      render={({ field, fieldState }) =>
        renderGenericInput(type, {
          disabled: controllerProps.disabled,
          error: fieldState.error?.message,
          ...field,
          ...props,
          ...resolveAdapter(field, adapterProps),
        } as InputNamesToProps[K])
      }
    />
  );
}

export function formFactory<M extends InputObjectMapping, TFieldValues extends FieldValues = FieldValues>(
  inputMap: M,
  config: { control: Control<TFieldValues>; rules?: UseControllerProps<TFieldValues>['rules']; disableAll?: boolean; shouldUnregister?: boolean }
) {
  function input<TName extends keyof M & FieldPath<TFieldValues>>(name: TName, props?: ControlledInputNameToProps<M[TName]['type']>) {
    const inputConfig = inputMap[name];
    return renderControlledInput(
      inputConfig.type,
      merge(inputConfig.props, props as object),
      {
        ...inputConfig.controlProps,
        name,
        control: config.control,
        disabled: config.disableAll ?? inputConfig.controlProps?.disabled,
        shouldUnregister: config.shouldUnregister,
        rules: merge(config.rules, inputConfig.controlProps?.rules),
      },
      inputConfig.adapter
    );
  }

  function inputs<TName extends keyof M & FieldPath<TFieldValues>>(names?: TName[], props?: any) {
    const inputNamesToRender = names && names.length > 0 ? names : (Object.keys(inputMap) as Array<TName>);
    return inputNamesToRender.map((it) => input(it, props));
  }

  return { input, inputs };
}

// Performance heavy. Not recommended.

// export type RHKInputEntries<M extends InputObjectMapping> = {
//   [P in keyof M]: InputNamesToProps[M[P]['type']]['value'];
// };
