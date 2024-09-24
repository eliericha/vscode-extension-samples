# test-env README

The goal of this workspace is to demonstrate an issue with the `extensionHost` debug configuration and the invocation of VS Code tasks within the debugged instance.

The `extensionHost` debug configuration has the `env` and `envFile` properties that allow setting environment variables for the debugged instance.

The issue is that the environment variables are correctly passed to the debugged `node` process, but they are not inherited by VS Code tasks spawned by the debugged process.

When a `vscode.ShellExecution` is created without an `env` option, it is supposed to inherit from `process.env`. However it seems that it is inheriting from a version of `process.env` that doesn't have the environment variables specified in the `extensionHost` debug configuration.

I suspect that `process.env` is cached too early, before the environment variables of the debug configuration are inserted, and thus tasks inherit from an outdated environment.

This is best illustrated by the last test in `src/test/extension.test.ts`, called `Task env after process.env modification`. In that test an environment variable is added to `process.env`, and a `vscode.ShellExecution` is invoked to demonstrate that the environment variable is not inherited.

To run the tests, run `npm install` and invoke the `Run Extension Tests` debug configuration defined in `launch.json`.
