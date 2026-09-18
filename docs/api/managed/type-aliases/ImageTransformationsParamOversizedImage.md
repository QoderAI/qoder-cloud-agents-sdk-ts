[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ImageTransformationsParamOversizedImage

# Type Alias: ImageTransformationsParamOversizedImage

> **ImageTransformationsParamOversizedImage** = `string`

What the server does when this image exceeds the model's maximum image size.
`"downsize"` (the default) scales the image down to fit, which changes the
dimensions the model observes without telling you. `"error"` instead rejects the
request with a 400 error naming the image's dimensions and the largest
dimensions that fit, so you can scale the image deliberately — your image is
never silently scaled down.
