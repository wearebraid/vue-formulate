describe('FormulateFileInput', () => {

  it('Can have one file displayed', () => {
    cy.visit('http://localhost:7872')

    cy.get('.file-input-1 input')
      .attachFile('1x1.png', { force: true })

    cy.get('.file-input-1 ul.formulate-files li')
      .should('have.length', 1)

    cy.get('.file-input-1 .formulate-file .formulate-file-name')
      .should('contain.text', '1x1.png')
  })

})
