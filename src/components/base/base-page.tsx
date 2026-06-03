import { Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import BlurEffect from 'react-progressive-blur'

import { BaseErrorBoundary } from './base-error-boundary'

interface Props {
  title?: React.ReactNode // the page title
  header?: React.ReactNode // something behind title
  contentStyle?: React.CSSProperties
  children?: ReactNode
  full?: boolean
}

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        <header
          data-tauri-drag-region="true"
          style={{
            userSelect: 'none',
            position: 'fixed',
            top: '0',
            height: '52px',
            width: 'calc(100vw - 236px - 8px)',
            zIndex: '10',
          }}
        >
          <Typography style={{ zIndex: '20' }} data-tauri-drag-region="true">
            {title}
          </Typography>

          {header}

          <BlurEffect
            className="header__blurEffect"
            position="top"
            intensity={50}
          />
        </header>

        <div
          className={full ? 'base-container no-padding' : 'base-container'}
          style={{ backgroundColor: 'transparent' }}
        >
          <section
            style={{
              backgroundColor: 'transparent',
              paddingTop: '52px',
            }}
          >
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
      </div>
    </BaseErrorBoundary>
  )
}
