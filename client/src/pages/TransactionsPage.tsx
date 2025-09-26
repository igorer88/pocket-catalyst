import { useEffect, useMemo } from 'react'
import { Spinner, Tab, Tabs } from '@heroui/react'

import BudgetTable from '@/components/BudgetTable'
import {
  ApiSubscription,
  ApiTransaction,
  useSubscriptionStore,
  useTransactionStore,
} from '@/stores'
import { formatCurrency } from '@/utils'

const transactionsTableColumns = [
  { label: 'Date', key: 'date' },
  { label: 'Category', key: 'category' },
  { label: 'Description', key: 'description' },
  { label: 'Amount', key: 'amount' },
]

const subscriptionsTableColumns = [
  { label: 'Description', key: 'description' },
  { label: 'Category', key: 'category' },
  { label: 'Amount', key: 'amount' },
  { label: 'Frequency', key: 'frequency' },
  { label: 'Next Payment', key: 'nextPayment' },
  { label: 'Status', key: 'status' },
]

const calculateTotal = (rows: Array<{ amount: string }>): number => {
  return rows.reduce((sum, row) => {
    const amountValue = parseFloat(row.amount)
    return sum + (isNaN(amountValue) ? 0 : amountValue)
  }, 0)
}

function TransactionsPage() {
  const {
    transactions,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    fetchTransactions,
  } = useTransactionStore()
  const {
    subscriptions,
    isLoading: isLoadingSubscriptions,
    error: errorSubscriptions,
    fetchSubscriptions,
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
      <Tabs aria-label="Budget Information" color="primary">
        <Tab key="income" title="Income">
          <div className="space-y-4">
            {isLoadingTransactions && <Spinner label="Loading income..." />}
            {errorTransactions && (
              <p className="text-danger">Error: {errorTransactions}</p>
            )}
            {!isLoadingTransactions && !errorTransactions && (
              <BudgetTable
                columns={transactionsTableColumns}
                rows={incomeTransactions.map((item: ApiTransaction) => ({
                  key: item.id,
                  date: item.date,
                  category: item.category?.title || 'N/A',
                  description: item.description,
                  amount: formatCurrency(
                    parseFloat(item.amount),
                    item.account_currency
                  ),
                }))}
                ariaLabel="Income table with dynamic content"
              />
            )}
            <div className="text-right font-semibold text-lg">
              Total Income:{' '}
              {formatCurrency(
                totalIncome,
                incomeTransactions[0]?.account_currency
              )}
            </div>
          </div>
        </Tab>
        <Tab key="expenses" title="Expenses">
          <div className="space-y-4">
            {isLoadingTransactions && <Spinner label="Loading expenses..." />}
            {errorTransactions && (
              <p className="text-danger">Error: {errorTransactions}</p>
            )}
            {!isLoadingTransactions && !errorTransactions && (
              <BudgetTable
                columns={transactionsTableColumns}
                rows={expenseTransactions.map((item: ApiTransaction) => ({
                  key: item.id,
                  date: item.date,
                  category: item.category?.title || 'N/A',
                  description: item.description,
                  amount: formatCurrency(
                    parseFloat(item.amount),
                    item.account_currency
                  ),
                }))}
                ariaLabel="Expenses table with dynamic content"
              />
            )}
            <div className="text-right font-semibold text-lg">
              Total Expenses:{' '}
              {formatCurrency(
                totalExpenses,
                expenseTransactions[0]?.account_currency
              )}
            </div>
          </div>
        </Tab>
        <Tab key="subscriptions" title="Subscriptions">
          <div className="space-y-4">
            {isLoadingSubscriptions && (
              <Spinner label="Loading subscriptions..." />
            )}
            {errorSubscriptions && (
              <p className="text-danger">Error: {errorSubscriptions}</p>
            )}
            {!isLoadingSubscriptions && !errorSubscriptions && (
              <BudgetTable
                columns={subscriptionsTableColumns}
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
                  status: item.is_active ? 'Active' : 'Paused',
                }))}
                ariaLabel="Subscriptions table with dynamic content"
              />
            )}
            <div className="text-right font-semibold text-lg">
              Total Subscriptions:{' '}
              {formatCurrency(totalSubscriptions, subscriptions[0]?.currency)}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default TransactionsPage
