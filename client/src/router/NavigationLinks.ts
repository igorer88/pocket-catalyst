import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import {
  ArrowsRightLeftIcon as ArrowsRightLeftIconOutline,
  ChartPieIcon as ChartPieIconOutline,
  HomeIcon as HomeIconOutline,
  WalletIcon as WalletIconOutline,
} from '@heroicons/react/24/outline';
import {
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  ChartPieIcon as ChartPieIconSolid,
  HomeIcon as HomeIconSolid,
  WalletIcon as WalletIconSolid,
} from '@heroicons/react/24/solid';

export interface NavigationLink {
  name: string;
  href: string;
  icon?: {
    outline?: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string | undefined;
        titleId?: string | undefined;
      } & RefAttributes<SVGSVGElement>
    >;
    solid?: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string | undefined;
        titleId?: string | undefined;
      } & RefAttributes<SVGSVGElement>
    >;
  }
  children?: NavigationLink[];

}

export const navigationLinks: NavigationLink[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: {
      outline: HomeIconOutline,
      solid: HomeIconSolid,
    }
  },
  {
    name: 'Transactions',
    href: '/dashboard/transactions',
    icon: {
      outline: ArrowsRightLeftIconOutline,
      solid: ArrowsRightLeftIconSolid,
    },
    children: [
      { name: 'List', href: '/dashboard/transactions' },
      { name: 'Add New', href: '/dashboard/transactions/add' },
      { name: 'Recurring', href: '/dashboard/subscriptions' },
    ],
  },
  {
    name: 'Accounts',
    href: '/dashboard/accounts',
    icon: {
      outline: WalletIconOutline,
      solid: WalletIconSolid,
    },
    children: [
      { name: 'My Accounts', href: '/dashboard/accounts' },
      { name: 'Add New', href: '/dashboard/accounts/add' },
      { name: 'Account Types', href: '/dashboard/accounts/types' },
    ],
  },
  {
    name: 'Budgets',
    href: '/dashboard/budgets',
    icon: {
      outline: ChartPieIconOutline,
      solid: ChartPieIconSolid,
    }
  },
];
