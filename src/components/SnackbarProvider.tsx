import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'

type Context = { show: (msg: string, severity?: 'success'|'error'|'info'|'warning') => void }
const Ctx = createContext<Context>({ show: ()=>{} })

export const useSnackbar = () => useContext(Ctx)

export default function SnackbarProvider({ children }: { children: ReactNode }){
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [sev, setSev] = useState<'success'|'error'|'info'|'warning'>('info')

  const show = (m:string, s:'success'|'error'|'info'|'warning'='info')=>{ setMsg(m); setSev(s); setOpen(true) }

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
        <Alert onClose={()=>setOpen(false)} severity={sev} sx={{width:'100%'}}>{msg}</Alert>
      </Snackbar>
    </Ctx.Provider>
  )
}
