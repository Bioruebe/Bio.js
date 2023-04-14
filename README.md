# BioLib (*Bio.js*)
A helper library used in most of my JS/TS projects.

It provides helper functions for common tasks, including an extensive collection of utilities for working with arrays, objects and strings.

## Installation
``` bash
npm i biolib
```

## Usage
Biolib provides both CommonJS and ESM exports. Type definitions are included.

Depending on your build system import the functions you want to use either from the corresponding package (recommended)
``` typescript
import { isEmptyArray } from "biolib/array";
```

or from the main bundle
``` typescript
import { isEmptyArray } from "biolib";
```
