/**
 * Checks if an object is empty
 *
 * @param objectName Object to check
 * @returns {boolean} boolean
 */
export const isEmptyObject = (objectName: object): boolean => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  )
}

/**
 * Returns the appropriate datetime function string based on the database driver
 *
 * @returns {string} Database-specific datetime function
 */
export const getCurrentTimestampFunction = (): string => {
  const dbDriver = process.env.DB_DRIVER || 'sqlite'

  switch (dbDriver) {
    case 'sqlite':
      return "datetime('now')"
    case 'postgres':
    case 'mysql':
    case 'mssql':
    default:
      return 'now()'
  }
}
