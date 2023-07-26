import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import LoadingButton from "@mui/lab/LoadingButton"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { DisabledProvider } from "@/components/RHFControls"

export type RHFDialogProps<
  ST extends z.ZodTypeAny,
  T = z.infer<ST>
> = React.PropsWithChildren<{
  isOpen: boolean
  title: string
  content?: string
  schema: ST
  defaultValues: T
  onCancel: () => void
  onSubmit: (data: T) => Promise<null | string>
}>

function RHFDialog<ST extends z.ZodTypeAny, T = z.infer<ST>>({
  isOpen,
  title,
  content,
  schema,
  defaultValues,
  children,
  onCancel,
  onSubmit,
}: RHFDialogProps<ST>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState<boolean>(false)

  // reset defaults.
  React.useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

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
      <DialogContent dividers>
        {content && <DialogContentText>{content}</DialogContentText>}
        <FormProvider {...form}>
          <DisabledProvider disabled={submitting}>{children}</DisabledProvider>
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

export default RHFDialog
