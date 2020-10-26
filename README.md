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

## Extension Settings

This extension contributes most of the [rejig flags](https://github.com/mjstewart/rejig#args).

example `settings.json`
```

  "rejig.prefixGroups": [
    "DA"
  , "DA.Next"
  , "DA.Finance"
  , "Daml"
  , "Test.MyApp"
  , "Main.MyApp"
  ],
  "rejig.displayImportGroupTitles": true,
  "rejig.displayImportBorderTop": true,
  "rejig.displayImportBorderBottom": true,
  "rejig.writeErrorFile": true
```

* `rejig.prefixGroups`: Most specific prefixes must be listed last
* `rejig.writeErrorFile`: within workspace root, errors are written to `rejig-error.txt`. Recommended to add this file to `.gitignore`.

## Known Issues

Please create a github issue

## Release Notes

### 1.0.0

Initial release

**Enjoy!**
