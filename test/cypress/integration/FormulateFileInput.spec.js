import FileUpload from '../../../src/FileUpload'

describe('FormulateFileInput', () => {

  it('Can have one file displayed and removed', () => {
    cy.formulate('file').find('input')
      .attachFile('1x1.png', { force: true })

    cy.get('@wrapper')
      .find('ul.formulate-files li')
      .should('have.length', 1)

    cy.get('@wrapper')
      .find('.formulate-file .formulate-file-name')
      .should('contain.text', '1x1.png')

    cy.modeledValue().should('have.nested.property', 'constructor.name', 'FileUpload')
    cy.submittedValue()
      .should('have.lengthOf', 1)
      .should('have.nested.property', '[0].name', '1x1.png')

    cy.get('@wrapper')
      .find('.formulate-file-remove')
      .click()

    cy.submittedValue()
      .should('have.lengthOf', 0)
  })

  it('Can have multiple files displayed and removed', () => {
    cy.formulate('file', { multiple: true })
      .find('input')
      .attachFile('1x1.png', { force: true })
      .attachFile('2x2.png', { force: true })

    cy.get('@wrapper')
      .find('ul.formulate-files li')
      .should('have.length', 2)
  })

})
