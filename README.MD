<h1 align="center">ts-npmrc</h1>
<p align="center">A simple CLI tool for managing multiple npm profiles</p>

## Overview

`ts-npmrc` is a command line tool for managing multiple `.npmrc` files. Built to provide an updated alternative to [npmrc](https://www.npmjs.com/package/npmrc), `ts-npmrc` has all previous features, support for requested features and provides more control over linking capabilities. As an alternative to `npmrc`, it uses the same `NPMRC_STORE` path allowing you to switch to `ts-npmrc` with ease and grace. Currently, you can manage (create/delete/link/list) .npmrc files via this tool.

## Goal

This tool aims to provide an updated npmrc profile manager which takes into consideration more recent configuration use cases in DevOps/CI pipelines and workflows.

Feel free to open an issue for any discussions (on use cases, design, implementation), suggestions or features requests you may have.

## Installation

```
$ npm install -g ts-npmrc
```

### Note for Windows

You may have to use a shell (cmd, PowerShell, etc) with elevated privileges (run as administrator).

## Environment Variables

- `NPMRC` - Path to .npmrc file used by npm. Defaults to npm's per-user config file `~/.npmrc`
- `NPMRC_STORE`- Path to directory of stored profiles. Defaults to `~/.npmrcs/`.

## Usage

```
$ ts-npmrc --help

ts-npmrc: A simple tool for managing multiple .npmrc profiles

usage: ts-npmrc [-h] <command> ...

Positional arguments:
  <command>
    create    Create a new profile
    delete    Deletes a stored profile
    list      Lists all stored .npmrc profiles
    link      Creates symlink for specified profile

Optional arguments:
  -h, --help  Show this help message and exit.

For detailed help about a specific command, use: ts-npmrc <command>
-h

```

#### Initialization

When executing, `ts-npmrc` will create the npmrc store directory (specified by `NPMRC_STORE` or `~/.npmrcs/`)  if it doesn't exist. If you have a .npmrc file in the directory (specified by `NPMRC` or `~/.npmrc`), `ts-npmrc` will copy this to a .npmrc profile named 'default' and **AUTOMATICALLY** create a symbolic link to point to it. 

```
$ ts-npmrc

ts-npmrc: A simple tool for managing multiple .npmrc profiles

npmrc-store folder does not exist. ts-npmrc will create a store to manage your profiles

Creating npmrc-store at ~\.npmrcs
Linking default profile...
Activating .npmrc (default)

```

**NOTE**: This is the only time the tool automatically links a target profile, for all other you must manually run `ts-npmrc link -p <target_profile>` for activation. 

#### Create a new profile 
```
$ ts-npmrc create -p newProfile

ts-npmrc: A simple tool for managing multiple .npmrc profiles

Creating new profile for newProfile

```

#### List .npmrc profiles in store
```
$ ts-npmrc list 

ts-npmrc: A simple tool for managing multiple .npmrc profiles

Stored profiles:

 newProfile (active)
 default

```

#### Delete a .npmrc profile from store

```
$ ts-npmrc delete -p targetProfile

ts-npmrc: A simple tool for managing multiple .npmrc profiles

Attempting to delete profile targetProfile
The profile being deleted is currently active. Removing symlink to targetProfile.

Deleting: ~\.npmrc
You need to link a .npmrc profile using "ts-npmrc link".

Deleting: ~\.npmrcs\targetProfile

```

#### Link and activate a .npmrc profile
Linking in ts-npmrc is synonymous to switching profiles in npmrc. Instead of doing it automatically upon creation, we give users the power to manually link to a target profile.

```
$ ts-npmrc link -p targetProfile

ts-npmrc: A simple tool for managing multiple .npmrc profiles

ts-npmrc link is executing

Initializing link action
Linking targetProfile profile...
Removing old .npmrc at default
Activating .npmrc (targetProfile)

```

You can add config options to the target .npmrc profile manually or, via `npm-config` set followed by `npm adduser` or `npm login` to authenticate. In both cases, just simply run `ts-npmrc link -p <target>` after you've set up your target .npmrc file to activate. 


## FAQ

#### Differences with [npmrc](https://www.npmjs.com/package/npmrc)?

- Modular design using [@microsoft/ts-command-line ](https://www.npmjs.com/package/@microsoft/ts-command-line)
- Uses [@microsoft/node-core-library](https://www.npmjs.com/package/@microsoft/node-core-library) FileSystem API
- Ability to delete profile, manually link and sync (WIP)
- Structured and extensible using [@microsoft/ts-command-line](https://github.com/microsoft/rushstack/tree/master/libraries/ts-command-line#scaffold-model) scaffold pattern 
- No fuzzy matching

#### Private Registries?

More companies now use private registry solutions for securely sharing and distributing javascript modules within their organization. Private registries allow for: 

- Easy internal sharing of private and proprietary closed-source modules
- Better control of development and deployment workflow.
- Stricter security around deploying open-source modules.
- Compliance with legal requirements to host code on-premises.
- Better code discovery and sharing within their organization.

#### Why use multiple registries?

- Some of your modules are open-source and thus published to the public npm registry (https://registry.npmjs.org) and others are private and published to your private registry.
- You use multiple private registries: For example a company-wide registry for stable versions of modules and multiple per-team registries with nightly builds of each module.


