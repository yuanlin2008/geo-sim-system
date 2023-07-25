import Checkbox, { CheckboxProps } from "@mui/material/Checkbox"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

type RHFTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "inputRef" | "onChange" | "value" | "onBlur" | "helperText" | "error"
> &
  UseControllerProps<T>

export function RHFTextField<T extends FieldValues>(
  props: RHFTextFieldProps<T>
) {
  const { field, fieldState } = useController(props)
  return (
    <TextField
      {...props}
      name={field.name}
      inputRef={field.ref}
      helperText={fieldState.error?.message}
      error={fieldState.invalid}
      onChange={field.onChange}
      value={field.value}
      onBlur={field.onBlur}
    />
  )
}

type RHFCheckboxProps<T extends FieldValues> = Omit<
  CheckboxProps,
  "name" | "inputRef" | "onChange" | "value" | "onBlur" | "helperText" | "error"
> &
  UseControllerProps<T>

export function RHFCheckbox<T extends FieldValues>(props: RHFCheckboxProps<T>) {
  const { field, fieldState } = useController(props)
  return (
    <Checkbox
      {...props}
      name={field.name}
      inputRef={field.ref}
      onChange={field.onChange}
      value={field.value}
      onBlur={field.onBlur}
    />
  )
}
