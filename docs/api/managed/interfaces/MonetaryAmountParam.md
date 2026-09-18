[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MonetaryAmountParam

# Interface: MonetaryAmountParam

A monetary amount in a specific currency.

## Properties

### amount

> **amount**: `string`

Amount in minor units of the currency, as an integer decimal string with no
leading zeros: "2500" is $25.00 and "50" is fifty cents. A string rather than a
number so no float rounding is ever applied.

***

### currency

> **currency**: `"USD"`

Uppercase ISO-4217 currency code. `USD` is the only currency currently
supported; the accepted set is closed and grows only when a new currency is
priced.

Any of "USD".
