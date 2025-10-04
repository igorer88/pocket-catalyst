import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
import {
  ArrowsRightLeftIcon as ArrowsRightLeftIconOutline,
  ChartPieIcon as ChartPieIconOutline,
  HomeIcon as HomeIconOutline,
  WalletIcon as WalletIconOutline
} from '@heroicons/react/24/outline'
import {
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  ChartPieIcon as ChartPieIconSolid,
  HomeIcon as HomeIconSolid,
  WalletIcon as WalletIconSolid
} from '@heroicons/react/24/solid'
import { TFunction } from 'i18next'

export interface NavigationLink {
  name: string
  href: string
  icon?: {
    outline?: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string | undefined
        titleId?: string | undefined
      } & RefAttributes<SVGSVGElement>
    >
    solid?: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string | undefined
        titleId?: string | undefined
      } & RefAttributes<SVGSVGElement>
    >
  }
  children?: NavigationLink[]
}

export const getNavigationLinks = (t: TFunction): NavigationLink[] => [
  {
    name: t('navigation.overview'),
    href: '/dashboard',
    icon: {
      outline: HomeIconOutline,
      solid: HomeIconSolid
    }
  },
  {
    name: t('navigation.transactions'),
    href: '/dashboard/transactions',
    icon: {
      outline: ArrowsRightLeftIconOutline,
      solid: ArrowsRightLeftIconSolid
    },
    children: [
      {
        name: t('navigation.list'),
        href: '/dashboard/transactions'
      },
      {
        name: t('navigation.addNew'),
        href: '/dashboard/transactions/add'
      },
      {
        name: t('navigation.recurring'),
        href: '/dashboard/subscriptions'
      }
    ]
  },
  {
    name: t('navigation.accounts'),
    href: '/dashboard/accounts',
    icon: {
      outline: WalletIconOutline,
      solid: WalletIconSolid
    },
    children: [
      {
        name: t('navigation.myAccounts'),
        href: '/dashboard/accounts'
      },
      {
        name: t('navigation.addNew'),
        href: '/dashboard/accounts/add'
      },
      {
        name: t('navigation.accountTypes'),
        href: '/dashboard/accounts/types'
      }
    ]
  },
  {
    name: t('navigation.budgets'),
    href: '/dashboard/budgets',
    icon: {
      outline: ChartPieIconOutline,
      solid: ChartPieIconSolid
    }
  }
]

// Legacy export for backwards compatibility (deprecated)
export const navigationLinks: NavigationLink[] = []
