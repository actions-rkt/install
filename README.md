# JavaScript Action to Install Racket 

This action installs the current version of Racket.

It currently works only on Linux.

## Inputs

### `destination`

**Required** The installation directory for Racket. Default `'/opt/racket'`.

## Example usage

```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: actions-rkt/install@releases/v1
    - run: raco test .
```
