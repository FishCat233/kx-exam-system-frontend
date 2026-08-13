import { useEffect, useRef } from 'react'

import { useCodeSync } from '../../hooks/useCodeSync'

const AUTO_BACKUP_INTERVAL_MS = 60_000

export function AutoSaveBackup() {
  const { saveAllCodes } = useCodeSync()
  const savingRef = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (savingRef.current) return
      savingRef.current = true
      void saveAllCodes()
        .catch(() => {
          // 静默备份：失败不打扰考生，下一轮重试
        })
        .finally(() => {
          savingRef.current = false
        })
    }, AUTO_BACKUP_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [saveAllCodes])

  return null
}
