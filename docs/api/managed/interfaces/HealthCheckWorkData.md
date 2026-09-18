[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / HealthCheckWorkData

# Interface: HealthCheckWorkData

Work data for environment health checks.

This resource type is used for assessing the health of containers where work
occurs. The data is opaque to users; the runner handles the health check by
probing connectivity to required services.

## Properties

### id

> **id**: `string`

Health check identifier

***

### type?

> `optional` **type?**: `"healthcheck"`

Type of work data

Any of "healthcheck".
