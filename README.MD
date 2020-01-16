<h1 align="center">ts-npmrc</h1>
<p align="center">A simple CLI tool for managing multiple npm profiles</p>

## Overview

`ts-npmrc` is a command line tool for managing multiple `.npmrc` files. Built to provide an updated alternative to [npmrc](https://github.com/deoxxa/npmrc), `ts-npmrc` implements missing features and comes packed with new syncing (WIP) and linking capabilities. As an alternative to `npmrc`, it uses the same NPMRC_STORE path allowing you to switch to `ts-npmrc` with ease and grace. Currently, you can manage (create/delete/link/list) .npmrc files via this tool.

## Goal

This tool aims to provide an updated npmrc profile manager which takes into consider more recent configuration use cases in DevOps/CI pipelines and workflows. 

Feel free to open an issue, for discussions (on use cases, design, implementation), suggestions or features requests you may have.

**Features under WIP**
- Sync profile (Instead of creating symbolic link from ~/.npmrc to target profile)
- Trim undefined environment variable

## Installation

```
$ npm install -g ts-npmrc
```

## Usage

```
$ ts-npmrc --help

ts-npmrc: A simple tool for managing multiple .npmrcs

usage: ts-npmrc [-h] <command> ...

Positional arguments:
  <command>
    profile   Either create, delete or list npmrc profiles in store
    link      Create symbolic link for specified profile

Optional arguments:
  -h, --help  Show this help message and exit.

```

#### Initialization

When executing, if npmrcStore (~/.npmrcs) does not exist, `ts-npmrc` will create the npmrcStore folder in a user's home directory to store npm profiles. If you have a .npmrc in the home directory (~/.npmrc), ts-npmrc will copy this to the default .npmrc profile and AUTOMATICALLY create a symbolic link to point to it. 

```
$ ts-npmrc

ts-npmrc: A simple tool for managing multiple .npmrcs

npmrc-store folder does not exist. ts-npmrc will create a store to manage your profiles

Creating npmrc-store at C:\Users\Darsi\.npmrcs
Making C:\Users\Darsi\.npmrc the default npmrc
Call link function on default
Linking default profile...
Activating .npmrc (default)

```

**NOTE**: This is the only time the tool automatically links a target profile, for all other you must manually run `ts-npmrc link -p <target_profile>` for activation. 

#### Create a new profile 
```
$ ts-npmrc profile -c newProfile

ts-npmrc: A simple tool for managing multiple .npmrcs

Creating new profile for newProfile

```

#### List profiles in store
```
$ ts-npmrc profile -l

ts-npmrc: A simple tool for managing multiple .npmrcs

Retrieving existing profiles from npmrc-store:
default
newProfile

```

#### Delete profile from store

```
$ ts-npmrc profile -d targetProfile

ts-npmrc: A simple tool for managing multiple .npmrcs

Deleting profile targetProfile
Deleting: C:\Users\Darsi\.npmrcs\targetProfile

```

#### Linking a targetProfile
Linking in ts-npmrc is synonymous to switching profiles in npmrc. Instead of doing it automatically upon creation, we give users the power to manually link to a target profile.

```
$ ts-npmrc link -p targetProfile

ts-npmrc: A simple tool for managing multiple .npmrcs

ts-npmrc link is executing
Initializing link action
Linking targetProfile profile...
Activating .npmrc (targetProfile)
```

You can add config options to the profile manually or, via npm-config set followed by `npm adduser` or `npm login` to authenticate. In both cases, just simply run `ts-npmrc link -p <target>` after you've set up your targets .npmrc file to activate. 


## FAQ

#### Differences with npmrc

- Uses FileSystem @microsoft/node-core-library
- Ability to delete profile, manually link and sync (WIP)
- Modular design using @microsoft/ts-command-line
- No fuzzy matching
- Structured and extensible using ts-command-line scaffold pattern

#### Private Registries?

More companies now use private registry solutions for securely sharing and distributing javascript modules within their organization. Private registries allow for: 

- Easy internal sharing of private and proprietary closed-source modules
- Better control of development and deployment workflow.
- Stricter security around deploying open-source modules.
- Compliance with legal requirements to host code on-premises.
- Better code discovery and sharing within their organization.

##### Why use multiple registries?

- Some of your modules are open-source and thus published to the public npm registry (https://registry.npmjs.org) and others are private and published to your private registry.
- You use multiple private registries: For example a company-wide registry for stable versions of modules and multiple per-team registries with nightly builds of each module.


