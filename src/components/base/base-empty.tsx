import { alpha, Box, Typography } from '@mui/material'
import { TrayIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { TranslationKey } from '@/types/generated/i18n-keys'

interface Props {
  text?: ReactNode
  textKey?: TranslationKey
  extra?: ReactNode
}

export const BaseEmpty = ({
  text,
  textKey = 'shared.statuses.empty',
  extra,
}: Props) => {
  const { t } = useTranslation()

  const resolvedText: ReactNode = text !== undefined ? text : t(textKey)

  return (
    <Box
      sx={({ palette }) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: alpha(palette.text.secondary, 0.75),
      })}
    >
      <Box
        component={TrayIcon}
        className="MuiSvgIcon-root"
        sx={{ fontSize: '4em' }}
      />
      <Typography sx={{ fontSize: '1.25em' }}>{resolvedText}</Typography>
      {extra}
    </Box>
  )
}
