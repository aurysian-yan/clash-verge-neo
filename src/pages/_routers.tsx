import {
  ArticleIcon,
  DatabaseIcon,
  GearIcon,
  GitForkIcon,
  GlobeIcon,
  HouseIcon,
  LockOpenIcon,
  WifiHighIcon,
} from '@phosphor-icons/react'
import { createBrowserRouter, RouteObject } from 'react-router'

import ConnectionsSvg from '@/assets/image/itemicon/connections.svg?react'
import HomeSvg from '@/assets/image/itemicon/home.svg?react'
import LogsSvg from '@/assets/image/itemicon/logs.svg?react'
import ProfilesSvg from '@/assets/image/itemicon/profiles.svg?react'
import ProxiesSvg from '@/assets/image/itemicon/proxies.svg?react'
import RulesSvg from '@/assets/image/itemicon/rules.svg?react'
import SettingsSvg from '@/assets/image/itemicon/settings.svg?react'
import UnlockSvg from '@/assets/image/itemicon/unlock.svg?react'

import Layout from './_layout'
import ConnectionsPage from './connections'
import HomePage from './home'
import ProfilesPage from './profiles'
import ProxiesPage from './proxies'
import RulesPage from './rules'
import SettingsPage from './settings'
import UnlockPage from './unlock'

export const navItems = [
  {
    label: 'layout.components.navigation.tabs.home',
    path: '/',
    icon: [<HouseIcon key="mui" />, <HomeSvg key="svg" />],
    Component: HomePage,
  },
  {
    label: 'layout.components.navigation.tabs.proxies',
    path: '/proxies',
    icon: [<WifiHighIcon key="mui" />, <ProxiesSvg key="svg" />],
    Component: ProxiesPage,
  },
  {
    label: 'layout.components.navigation.tabs.profiles',
    path: '/profile',
    icon: [<DatabaseIcon key="mui" />, <ProfilesSvg key="svg" />],
    Component: ProfilesPage,
  },
  {
    label: 'layout.components.navigation.tabs.connections',
    path: '/connections',
    icon: [<GlobeIcon key="mui" />, <ConnectionsSvg key="svg" />],
    Component: ConnectionsPage,
  },
  {
    label: 'layout.components.navigation.tabs.rules',
    path: '/rules',
    icon: [<GitForkIcon key="mui" />, <RulesSvg key="svg" />],
    Component: RulesPage,
  },
  {
    label: 'layout.components.navigation.tabs.logs',
    path: '/logs',
    icon: [<ArticleIcon key="mui" />, <LogsSvg key="svg" />],
    Component: () => null /* KeepAlive: real LogsPage rendered in Layout */,
  },
  {
    label: 'layout.components.navigation.tabs.unlock',
    path: '/unlock',
    icon: [<LockOpenIcon key="mui" />, <UnlockSvg key="svg" />],
    Component: UnlockPage,
  },
  {
    label: 'layout.components.navigation.tabs.settings',
    path: '/settings',
    icon: [<GearIcon key="mui" />, <SettingsSvg key="svg" />],
    Component: SettingsPage,
  },
]

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: navItems.map(
      (item) =>
        ({
          path: item.path,
          Component: item.Component,
        }) as RouteObject,
    ),
  },
])
