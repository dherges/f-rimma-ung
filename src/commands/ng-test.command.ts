import { Command } from './command';
import * as shell from 'shelljs';

export class NgBuildCommand implements Command {

  run(): Promise<void> {

    return new Promise((resolve, reject) => {
      shell.exec(`ng test`, { cwd: process.env.CMD }, (code, out, err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

}
