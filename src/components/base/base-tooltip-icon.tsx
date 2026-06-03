import {
  Tooltip,
  IconButton,
  IconButtonProps,
  SvgIconProps,
} from '@mui/material'
import { InfoIcon } from '@phosphor-icons/react'

interface Props extends IconButtonProps {
  title?: string
  icon?: React.ElementType<SvgIconProps>
}

export const TooltipIcon: React.FC<Props> = (props: Props) => {
  const { title = '', icon: Icon = InfoIcon, ...restProps } = props

  return (
    <Tooltip title={title} placement="top">
      <IconButton color="inherit" size="small" {...restProps}>
        <Icon size="1em" style={{ cursor: 'pointer', opacity: 0.75 }} />
      </IconButton>
    </Tooltip>
  )
}
