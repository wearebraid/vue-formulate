/**
 * This function is responsible for providing Vue Formulate’s css classes.
 * The class system works a bit like middleware. This function will be called
 * with the specific element ('label' for example) that it needs to generate
 * classes for, and the context object, it returns an array of classes.
 *
 * These classes can be extended, or overwritten by other elements.
 */
export default function (element, context) {
  const namespace = 'formulate'
  const type = element === 'form' ? element : 'input'
  const classes = [`${namespace}-${type}${type !== element ? `-${element}` : ''}`]
  return classes
}
