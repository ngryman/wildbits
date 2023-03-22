// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'

function escapeHTML(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

Cypress.Keyboard.defaults({
  keystrokeDelay: 1,
})

chai.Assertion.addMethod('matchHTML', function (expected: string) {
  const $element = this._obj

  new chai.Assertion($element).to.exist

  const actual = $element.html()
  const augmentedExpected = expected
    // match anything at the beginning of an opening tag
    .replaceAll(
      /<(\w+)\s?([^>]+)?>/g,
      (_, tagName, rest) => `<${tagName}.*${rest ? `${rest}.*` : ''}>`
    )
    // match anything in between tags
    .replaceAll('><', '>.*<')
    // sanitize attributes
    .replaceAll(/([\w-]+)="([^"]+)"/g, (_, name, value) => `${name}="${escapeRegExp(value)}"`)
    // match anything in spaces between attributes
    .replaceAll(/"\s+(\w)/g, '".*$1')
  const expectedRegExp = new RegExp(augmentedExpected, 'm')

  this.assert(
    expectedRegExp.test(actual),
    `Expected #{this} to match HTML ${escapeHTML(
      expectedRegExp.toString()
    )}, but the HTML was ${escapeHTML(actual)}`,
    `Expected #{this} not to have HTML ${escapeHTML(expectedRegExp.toString())}`,
    expected,
    actual
  )
})

// <p>B</p><figure><img src="https:\/\/images\.unsplash\.com\/photo-1615963244664-5b845b2025ee\?h=100".*><\/figure><p.*>🥖A<\/p>
// <p>B</p><figure><img alt="" src="https://images.unsplash.com/photo-1615963244664-5b845b2025ee?h=100" class="_image_1cinv_29"></figure><p>🥖A</p>
