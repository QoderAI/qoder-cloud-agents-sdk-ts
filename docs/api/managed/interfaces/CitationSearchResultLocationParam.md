[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CitationSearchResultLocationParam

# Interface: CitationSearchResultLocationParam

The properties CitedText, EndBlockIndex, SearchResultIndex, Source,
StartBlockIndex, Title, Type are required.

## Properties

### cited\_text

> **cited\_text**: `string`

The full text of the cited block range, concatenated.

Always equals the contents of `content`start_block_index:end_block_index``
joined together. The text block is the minimal citable unit; this field is never
a substring of a single block. Not counted toward output tokens, and not counted
toward input tokens when sent back in subsequent turns.

***

### end\_block\_index

> **end\_block\_index**: `number`

Exclusive 0-based end index of the cited block range in the source's `content`
array.

Always greater than `start_block_index`; a single-block citation has
`end_block_index = start_block_index + 1`.

***

### search\_result\_index

> **search\_result\_index**: `number`

0-based index of the cited search result among all `search_result` content
blocks in the request, in the order they appear across messages and tool
results.

Counted separately from `document_index`; server-side web search results are not
included in this count.

***

### source

> **source**: `string`

***

### start\_block\_index

> **start\_block\_index**: `number`

0-based index of the first cited block in the source's `content` array.

***

### title

> **title**: `string`

***

### type?

> `optional` **type?**: `"search_result_location"` \| `null`

This field can be elided, and will marshal its zero value as
"search_result_location".
