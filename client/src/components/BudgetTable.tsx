import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

interface Column {
  key: string;
  label: string;
}

interface Row {
  key: string;
  [key: string]: unknown;
}

interface BudgetTableProps {
  columns: Column[];
  rows: Row[];
  ariaLabel: string;
  isStriped?: boolean;
}

function BudgetTable({
  columns,
  rows,
  ariaLabel,
  isStriped = false,
}: BudgetTableProps) {
  return (
    <Table isStriped={isStriped} aria-label={ariaLabel}>
      <TableHeader columns={columns}>
        {column => (
          <TableColumn
            key={column.key}
            align={column.key === 'amount' ? 'end' : 'start'}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <TableRow key={item.key}>
            {columnKey => (
              <TableCell align={columnKey === 'amount' ? 'right' : 'left'}>
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default BudgetTable
