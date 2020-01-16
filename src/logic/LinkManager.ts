import { Utilities } from '../utilities/Utilities';
import { FileSystem, IFileSystemCreateLinkOptions } from '@microsoft/node-core-library';
import * as fs from 'fs';
import * as path from 'path';

export enum SymlinkKind {
  File,
  Directory
}

/**
 * Options for LinkManager._createSymLink() inherits options from IFileSystemCreateLinkOptions 
 */
export interface ILinkManagerCreateSymlinkOptions extends IFileSystemCreateLinkOptions {
  symlinkKind: SymlinkKind;
}

export class LinkManager {

  private _npmrcStore: string;
  private _npmrc: string;

  public constructor() {
    this._npmrc = path.join(Utilities.getHomeDirectory(), '.npmrc');
    this._npmrcStore = path.join(Utilities.getHomeDirectory(), '.npmrcs');
    
  }

  /**
   * This is used to create the symbolic link to the the target profile
   * @param targetProfile The target profile the symbolic link points to
   */
  private _link(targetProfile: string): void {

    // ~/.npmrcs/targetProfile
    const link = path.join(this._npmrcStore, targetProfile);
    if (link == this._npmrcStore || !FileSystem.exists(link)) {
      console.error('Couldn\'t find npmrc file "%s".', targetProfile);
      return process.exit(1);
    }

    let lstat!: fs.Stats;

    try {
      lstat = FileSystem.getLinkStatistics(this._npmrc);
      this._checkSymLink(lstat);
    } catch (e) { /* no-op */ }

    if (lstat) {
      console.log('Removing old .npmrc at %s ', path.basename(fs.readlinkSync(this._npmrc)));
      FileSystem.deleteFile(this._npmrc);
    }

    console.log('Activating .npmrc (%s)', path.basename(link));

    // Symlinking ~/.npmrc ---> ~/.npmrcs/targetProfile
    this._createSymlink({
      linkTargetPath: link,
      newLinkPath: this._npmrc,
      symlinkKind: SymlinkKind.File
    });
  }

  /**
   * This is called to ensure we don't overwrite an existing .npmrc
   * @param stat File or Symlink status/information object 
   */
  private _checkSymLink(stat: fs.Stats): void {
    if (!stat.isSymbolicLink()) {
      console.log('The .npmrc (%s) is not a symlink. You may want to copy into npmrcs (%s)',this._npmrc ,this._npmrcStore);
      return process.exit(1);
    }
  }

  /**
   * This is called to retrieve information about a file and check if it is a symbolic link. 
   * @param stat File or Symlink status/information object 
   */
  // private _getLinkStats(stat: fs.Stats): fs.Stats {
  //   try {
  //     stat = FileSystem.getLinkStatistics(this._npmrc);
  //     this._checkSymLink(stat);
  //   } catch (e) { /* no-op */ }
    
  //   return stat;

  // }

  /**
   * This is called to create symbolic link to a targetProfile
   * @param options The options used by `FileSystem.createSymbolicLinkJunction()`, `createSymbolicLinkFile()`,
   *                `createSymbolicLinkFolder()`,  and `createHardLink()`.
   */
  private _createSymlink(options: ILinkManagerCreateSymlinkOptions): void {

    const newLinkFolder: string = path.dirname(options.newLinkPath);
    FileSystem.ensureFolder(newLinkFolder);

    // ~/.npmrcs/targetProfile
    const targetPath: string = options.linkTargetPath;
//    fs.chmodSync(options.newLinkPath, 0o600);
    fs.chmodSync(targetPath, 0o600);

    FileSystem.createSymbolicLinkFile({
      linkTargetPath: targetPath,
      newLinkPath: options.newLinkPath
    });
  }

  /**
   * This is called to set up targetProfile the .npmrc symbolic link will point to
   * @param profile 
   */
  public linkTargetProfile(profile: string): Promise<void> {
    if (!profile) {
      console.log('Specify a profile name to symlink');
      process.exit(1);
    }

    console.log('Linking %s profile...', profile);
    this._link(profile);

    return Promise.resolve();
  }
}