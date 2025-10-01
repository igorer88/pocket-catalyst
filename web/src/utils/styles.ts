/**
 * The function `classNames` takes an array of strings, filters out any falsy values, and joins the
 * remaining values with a space.
 * @param {string[]} classes - The `classes` parameter in the `classNames` function is a rest parameter
 * that allows you to pass in an arbitrary number of string arguments. These arguments represent CSS
 * class names that you want to concatenate together. The function filters out any falsy values (such
 * as empty strings, null, or undefined)
 * @returns The `classNames` function returns a string that concatenates all the non-empty strings
 * passed as arguments, separated by a space.
 */
export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}
