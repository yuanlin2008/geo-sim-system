/**
 * 根据Zod schema自动生成表单输入的对话框.
 */

import React from "react"
import LoadingButton from "@mui/lab/LoadingButton"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { z } from "zod"

import { FormProvider, TextField, useForm } from "@/components/ZodRHForm"

function AutoFormDialog<ST extends z.ZodTypeAny, T = z.infer<ST>>({
  isOpen,
  title,
  content,
  schema,
  defaultValues,
  names,
  onCancel,
  onSubmit,
}: {
  isOpen: boolean
  title: string
  content?: string
  schema: ST
  defaultValues: T
  names: [keyof T, string][]
  onCancel: () => void
  onSubmit: (data: T) => Promise<null | string>
}) {
  const form = useForm(schema, defaultValues)
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState<boolean>(false)

  function handleCancel() {
    form.reset()
    setError(null)
    setSubmitting(false)
    onCancel()
  }

  async function handleSubmit(data: T) {
    setError(null)
    setSubmitting(true)
    const r = await onSubmit(data)
    form.reset()
    if (r) setError(r)
    setSubmitting(false)
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content && <DialogContentText>{content}</DialogContentText>}
        <FormProvider {...form}>
          {names.map(([name, label]) => (
            <TextField
              key={name as string}
              disabled={submitting}
              margin="dense"
              label={label}
              name={name as string}
              size="small"
              fullWidth
              autoComplete="off"
            />
          ))}
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} onClick={handleCancel}>
          取消
        </Button>
        <LoadingButton
          loading={submitting}
          disabled={submitting}
          onClick={form.handleSubmit(handleSubmit)}
        >
          确定
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default AutoFormDialog
