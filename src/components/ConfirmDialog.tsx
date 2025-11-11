import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

type Props = { open: boolean; message: string; onConfirm: ()=>void; onCancel: ()=>void; title?: string }

export default function ConfirmDialog({ open, message, onConfirm, onCancel, title='Confirm' }: Props){
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent><Typography>{message}</Typography></DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">End Step</Button>
      </DialogActions>
    </Dialog>
  )
}
