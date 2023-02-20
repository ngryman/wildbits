import { schema } from './schema'

export const doc = schema.node('doc', null, [
  schema.node('heading', null, schema.text(`The Escape Plan`)),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `Welcome to the journey that will help you escape the monotony that is your current life. It will be hard, painful, and non-rewarding. But eventually, with enough perseverance and sweat, you will finally succeed.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `This book is the opposite of the current ambient bullshit that you can read out there, meant to suck all your money and energy for people that don't care about your success. I will focus on action items, retrospectives, experiments, failures, psychology, and all the stuff that will make you a better person overall.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `If you apply everything in this book, you will not be guaranteed success, but you will definitively have a meaning in your life.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `The first thing to tackle before anything else, is to know you meat.`
    )
  ),
])
