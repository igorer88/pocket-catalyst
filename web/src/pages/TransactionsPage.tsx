import { useEffect, useMemo } from 'react'
import { FormattedMessage, type IntlShape, useIntl } from 'react-intl'
import { Spinner, Tab, Tabs } from '@heroui/react'

import BudgetTable from '@/components/BudgetTable'
import {
  ApiSubscription,
  ApiTransaction,
  useSubscriptionStore,
  useTransactionStore
} from '@/stores'
import { formatCurrency } from '@/utils'

const transactionsTableColumns = (
  intl: IntlShape
): { label: string; key: string }[] => [
  { label: intl.formatMessage({ id: 'pages.transactions.date' }), key: 'date' },
  {
    label: intl.formatMessage({ id: 'pages.transactions.category' }),
    key: 'category'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.description' }),
    key: 'description'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.amount' }),
    key: 'amount'
  }
]

const subscriptionsTableColumns = (
  intl: IntlShape
): { label: string; key: string }[] => [
  {
    label: intl.formatMessage({ id: 'pages.transactions.description' }),
    key: 'description'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.category' }),
    key: 'category'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.amount' }),
    key: 'amount'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.frequency' }),
    key: 'frequency'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.nextPayment' }),
    key: 'nextPayment'
  },
  {
    label: intl.formatMessage({ id: 'pages.transactions.status' }),
    key: 'status'
  }
]

const calculateTotal = (rows: Array<{ amount: string }>): number => {
  return rows.reduce((sum, row) => {
    const amountValue = parseFloat(row.amount)
    return sum + (isNaN(amountValue) ? 0 : amountValue)
  }, 0)
}

function TransactionsPage() {
  const intl = useIntl()
  const {
    transactions,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    fetchTransactions
  } = useTransactionStore()
  const {
    subscriptions,
    isLoading: isLoadingSubscriptions,
    error: errorSubscriptions,
    fetchSubscriptions
  } = useSubscriptionStore()

  useEffect(() => {
    void fetchTransactions()
    void fetchSubscriptions()
  }, [fetchTransactions, fetchSubscriptions])

  const incomeTransactions = useMemo(
    () => transactions.filter(t => t.type === 'income'),
    [transactions]
  )
  const expenseTransactions = useMemo(
    () => transactions.filter(t => t.type === 'expense'),
    [transactions]
  )

  const totalIncome = useMemo(
    () => calculateTotal(incomeTransactions),
    [incomeTransactions]
  )
  const totalExpenses = useMemo(
    () => calculateTotal(expenseTransactions),
    [expenseTransactions]
  )
  const totalSubscriptions = useMemo(
    () => calculateTotal(subscriptions.filter(s => s.type === 'expense')),
    [subscriptions]
  )

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label={intl.formatMessage({ id: 'pages.transactions.ariaLabel' })}
        color="primary"
      >
        <Tab
          key="income"
          title={intl.formatMessage({ id: 'pages.transactions.income' })}
        >
          <div className="space-y-4">
            {isLoadingTransactions && (
              <Spinner
                label={intl.formatMessage({
                  id: 'pages.transactions.loadingIncome'
                })}
              />
            )}
            {errorTransactions && (
              <p className="text-danger">
                <FormattedMessage id="common.error" /> {errorTransactions}
              </p>
            )}
            {!isLoadingTransactions && !errorTransactions && (
              <BudgetTable
                columns={transactionsTableColumns(intl)}
                rows={incomeTransactions.map((item: ApiTransaction) => ({
                  key: item.id,
                  date: item.date,
                  category: item.category?.title || 'N/A',
                  description: item.description,
                  amount: formatCurrency(
                    parseFloat(item.amount),
                    item.account_currency
                  )
                }))}
                ariaLabel={intl.formatMessage({
                  id: 'pages.transactions.incomeTableAria'
                })}
              />
            )}
            <div className="text-right font-semibold text-lg">
              <FormattedMessage id="pages.transactions.totalIncome" />{' '}
              {formatCurrency(
                totalIncome,
                incomeTransactions[0]?.account_currency
              )}
            </div>
          </div>
        </Tab>
        <Tab
          key="expenses"
          title={intl.formatMessage({ id: 'pages.transactions.expenses' })}
        >
          <div className="space-y-4">
            {isLoadingTransactions && (
              <Spinner
                label={intl.formatMessage({
                  id: 'pages.transactions.loadingExpenses'
                })}
              />
            )}
            {errorTransactions && (
              <p className="text-danger">
                <FormattedMessage id="common.error" /> {errorTransactions}
              </p>
            )}
            {!isLoadingTransactions && !errorTransactions && (
              <BudgetTable
                columns={transactionsTableColumns(intl)}
                rows={expenseTransactions.map((item: ApiTransaction) => ({
                  key: item.id,
                  date: item.date,
                  category: item.category?.title || 'N/A',
                  description: item.description,
                  amount: formatCurrency(
                    parseFloat(item.amount),
                    item.account_currency
                  )
                }))}
                ariaLabel={intl.formatMessage({
                  id: 'pages.transactions.expensesTableAria'
                })}
              />
            )}
            <div className="text-right font-semibold text-lg">
              <FormattedMessage id="pages.transactions.totalExpenses" />{' '}
              {formatCurrency(
                totalExpenses,
                expenseTransactions[0]?.account_currency
              )}
            </div>
          </div>
        </Tab>
        <Tab
          key="subscriptions"
          title={intl.formatMessage({
            id: 'pages.transactions.subscriptions'
          })}
        >
          <div className="space-y-4">
            {isLoadingSubscriptions && (
              <Spinner
                label={intl.formatMessage({
                  id: 'pages.transactions.loadingSubscriptions'
                })}
              />
            )}
            {errorSubscriptions && (
              <p className="text-danger">
                <FormattedMessage id="common.error" /> {errorSubscriptions}
              </p>
            )}
            {!isLoadingSubscriptions && !errorSubscriptions && (
              <BudgetTable
                columns={subscriptionsTableColumns(intl)}
                rows={subscriptions.map((item: ApiSubscription) => ({
                  key: item.id,
                  description: item.subscription_service
                    ? `${item.subscription_service.name}: ${item.description}`
                    : item.description,
                  category: item.category?.title || 'N/A',
                  amount: formatCurrency(
                    parseFloat(item.amount),
                    item.currency
                  ),
                  frequency: `${item.frequency_value} ${
                    item.frequency_unit.charAt(0).toUpperCase() +
                    item.frequency_unit.slice(1)
                  }(s)`,
                  nextPayment: item.next_due_date,
                  status: item.is_active ? (
                    <FormattedMessage id="pages.transactions.active" />
                  ) : (
                    <FormattedMessage id="pages.transactions.paused" />
                  )
                }))}
                ariaLabel={intl.formatMessage({
                  id: 'pages.transactions.subscriptionsTableAria'
                })}
              />
            )}
            <div className="text-right font-semibold text-lg">
              <FormattedMessage id="pages.transactions.totalSubscriptions" />{' '}
              {formatCurrency(totalSubscriptions, subscriptions[0]?.currency)}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default TransactionsPage
