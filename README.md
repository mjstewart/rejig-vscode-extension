# rejig-vscode-extension

[rejig-vscode-extension](https://github.com/mjstewart/rejig-vscode-extension) connects
to the [rejig](https://github.com/mjstewart/rejig) module header formatting tool.

A command is registered and made available within `haskell` or `daml` files.

1. invoke the command pallete `ctrl+shift+p`
2. `>Rejig Document`

Any errors are written to `rejig-errors.txt` in workspace root by default.

![Output sample](https://github.com/mjstewart/rejig-vscode-extension/blob/master/rejig-vscode-sample.gif)

## Requirements

`rejig` must be available on `$PATH`. See [rejig](https://github.com/mjstewart/rejig) for an example setup.

## Install

This extension is not yet published on the marketplace so a manual install is required.

1. [Download lastest version](https://github.com/mjstewart/rejig-vscode-extension/releases)

2. `code --install-extension rejig-vscode-extension-0.0.1.vsix`


## Extension Settings

This extension contributes most of the [rejig flags](https://github.com/mjstewart/rejig#args).

Here's an example `settings.json` where `rejig.prefixGroups` are application specific.

```

  "rejig.prefixGroups": [
    "DA"
  , "DA.Next"
  , "DA.Finance"
  , "Daml"
  , "MyApp.Test"
  , "MyApp.Main"
  ],
  "rejig.displayImportGroupTitles": true,
  "rejig.displayImportBorderTop": true,
  "rejig.displayImportBorderBottom": true,
  "rejig.writeErrorFile": true
```

* `rejig.prefixGroups`: The most specific prefixes must be listed last
* `rejig.writeErrorFile`: within the workspace root directory, errors are written to `rejig-error.txt`. It's recommended to add this file to `.gitignore`.

## Known Issues

Please create a github issue

## Release Notes

See [CHANGELOG.md](https://github.com/mjstewart/rejig-vscode-extension/blob/master/CHANGELOG.md)
