import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@heroui/react'

import BudgetTable from '@/components/BudgetTable'
import {
  ApiSubscription,
  ApiTransaction,
  useSubscriptionStore,
  useTransactionStore
} from '@/stores'
import { formatCurrency } from '@/utils'

interface Row {
  key: string
  [key: string]: unknown
}

const transactionsTableColumns = (
  t: ReturnType<typeof useTranslation>['t']
): { label: string; key: string }[] => [
  { label: t('pages.transactions.date'), key: 'date' },
  { label: t('pages.transactions.category'), key: 'category' },
  { label: t('pages.transactions.description'), key: 'description' },
  { label: t('pages.transactions.amount'), key: 'amount' }
]

const subscriptionsTableColumns = (
  t: ReturnType<typeof useTranslation>['t']
): { label: string; key: string }[] => [
  { label: t('pages.transactions.description'), key: 'description' },
  { label: t('pages.transactions.category'), key: 'category' },
  { label: t('pages.transactions.amount'), key: 'amount' },
  { label: t('pages.transactions.frequency'), key: 'frequency' },
  { label: t('pages.transactions.nextPayment'), key: 'nextPayment' },
  { label: t('pages.transactions.status'), key: 'status' }
]

const formatTransactionRows = (transactions: ApiTransaction[]): Row[] => {
  return transactions.map((transaction, index) => ({
    key: index.toString(),
    date: transaction.date,
    category: transaction.category?.title || 'N/A',
    description: transaction.description,
    amount: `${transaction.amount} ${transaction.accountCurrency || 'USD'}`
  }))
}

const formatSubscriptionRows = (
  subscriptions: ApiSubscription[],
  t: ReturnType<typeof useTranslation>['t']
): Row[] => {
  return subscriptions.map((subscription, index) => ({
    key: index.toString(),
    description: subscription.description,
    category: subscription.category?.title || 'N/A',
    amount: `${subscription.amount} ${subscription.currency}`,
    frequency: `${subscription.frequencyValue} ${subscription.frequencyUnit}(s)`,
    nextPayment: subscription.nextDueDate,
    status: subscription.isActive
      ? t('pages.transactions.active')
      : t('pages.transactions.paused')
  }))
}

const TransactionsPage = (): React.JSX.Element => {
  const { t } = useTranslation()
  const {
    transactions,
    error: errorTransactions,
    isLoading: loadingTransactions,
    fetchTransactions
  } = useTransactionStore()

  const {
    subscriptions,
    error: errorSubscriptions,
    isLoading: loadingSubscriptions,
    fetchSubscriptions
  } = useSubscriptionStore()

  useEffect(() => {
    void fetchTransactions()
    void fetchSubscriptions()
  }, [fetchTransactions, fetchSubscriptions])

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => parseFloat(t.amount) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  }, [transactions])

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => parseFloat(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  }, [transactions])

  const totalSubscriptions = useMemo(() => {
    return subscriptions.reduce((sum, s) => sum + parseFloat(s.amount), 0)
  }, [subscriptions])

  const incomeData = useMemo(() => {
    const incomeTransactions = transactions.filter(
      t => parseFloat(t.amount) > 0
    )
    return formatTransactionRows(incomeTransactions)
  }, [transactions])

  const expenseData = useMemo(() => {
    const expenseTransactions = transactions.filter(
      t => parseFloat(t.amount) < 0
    )
    return formatTransactionRows(expenseTransactions)
  }, [transactions])

  const subscriptionData = useMemo(() => {
    return formatSubscriptionRows(subscriptions, t)
  }, [subscriptions, t])

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label={t('pages.transactions.ariaLabel')}
    >
      <Tabs
        variant="underlined"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-primary-500',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-primary-500'
        }}
      >
        <Tab
          key="income"
          title={
            <div className="flex items-center space-x-2">
              <span>{t('pages.transactions.income')}</span>
            </div>
          }
        >
          <div className="space-y-4">
            {loadingTransactions ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <span className="ml-2">
                  {t('pages.transactions.loadingIncome')}
                </span>
              </div>
            ) : errorTransactions ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                {t('common.error')} {errorTransactions}
              </div>
            ) : (
              <>
                <BudgetTable
                  rows={incomeData}
                  columns={transactionsTableColumns(t)}
                  ariaLabel={t('pages.transactions.incomeTableAria')}
                />
                <div className="flex justify-end">
                  <p className="text-lg font-semibold text-green-600">
                    {t('pages.transactions.totalIncome')}{' '}
                    {formatCurrency(totalIncome, 'USD')}
                  </p>
                </div>
              </>
            )}
          </div>
        </Tab>

        <Tab
          key="expenses"
          title={
            <div className="flex items-center space-x-2">
              <span>{t('pages.transactions.expenses')}</span>
            </div>
          }
        >
          <div className="space-y-4">
            {loadingTransactions ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <span className="ml-2">
                  {t('pages.transactions.loadingExpenses')}
                </span>
              </div>
            ) : errorTransactions ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                {t('common.error')} {errorTransactions}
              </div>
            ) : (
              <>
                <BudgetTable
                  rows={expenseData}
                  columns={transactionsTableColumns(t)}
                  ariaLabel={t('pages.transactions.expensesTableAria')}
                />
                <div className="flex justify-end">
                  <p className="text-lg font-semibold text-red-600">
                    {t('pages.transactions.totalExpenses')}{' '}
                    {formatCurrency(totalExpenses, 'USD')}
                  </p>
                </div>
              </>
            )}
          </div>
        </Tab>

        <Tab
          key="subscriptions"
          title={
            <div className="flex items-center space-x-2">
              <span>{t('pages.transactions.subscriptions')}</span>
            </div>
          }
        >
          <div className="space-y-4">
            {loadingSubscriptions ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <span className="ml-2">
                  {t('pages.transactions.loadingSubscriptions')}
                </span>
              </div>
            ) : errorSubscriptions ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                {t('common.error')} {errorSubscriptions}
              </div>
            ) : (
              <>
                <BudgetTable
                  rows={subscriptionData}
                  columns={subscriptionsTableColumns(t)}
                  ariaLabel={t('pages.transactions.subscriptionsTableAria')}
                />
                <div className="flex justify-end">
                  <p className="text-lg font-semibold text-blue-600">
                    {t('pages.transactions.totalSubscriptions')}{' '}
                    {formatCurrency(totalSubscriptions, 'USD')}
                  </p>
                </div>
              </>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default TransactionsPage
