# Entra Manifest Convert

A CLI tool to convert Microsoft Entra app manifests from Azure AD Graph format to Azure AD Graph format. For more information about the format, please check this [link](https://learn.microsoft.com/en-us/entra/identity-platform/azure-active-directory-graph-app-manifest-deprecation)

## Installation

```sh
npm install -g entra-manifest-convert
```

## Usage

```sh
entra-manifest-convert <path-to-manifest> [--out <output-file>] [--spaces <number-of-spaces>]
```

You can optionally specify an output file using the --out parameter and the number of spaces for JSON formatting using the --spaces parameter.

## Running Tests

```sh
npm test
```

## Repository

For more information, visit the [GitHub repository](https://github.com/SLdragon/entra-manifest-convert).