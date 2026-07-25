/**
 * Formats a number as Australian dollars, e.g. money(1234) => "A$1,234".
 * Non-finite input (undefined/null coerced to NaN upstream, or a bad sum
 * over legacy records) renders as A$0 rather than the literal "A$NaN".
 */
export const money = (n: number): string =>
  "A$" + (Number.isFinite(n) ? n : 0).toLocaleString("en-AU");
