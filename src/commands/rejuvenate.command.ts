import * as fs from 'fs-extra';
import { Command } from './command';
import { ReleaseRepository } from '../releases/release.repository';
import { Dependency } from '../releases/dependency';

export class RejuvenateCommand implements Command {

  constructor(
    private repositories: ReleaseRepository[],
    private project: string
  ) {}

  run(): Promise<void> {

    // read `${project}/package.json`
    return fs.readJson(`${this.project}/package.json`)
      .then((packageJson) => {

        return this.findMostRecent(packageJson['dependencies'])
          .then((dependencies) => {
            return dependencies.reduce((pkg, dep) => {
              pkg['dependencies'][dep.package] = dep.version;

              return pkg;
            }, packageJson);
          });
      })
      .then((packageJson) => {
        return this.findMostRecent(packageJson['devDependencies'])
          .then((dependencies) => {
            return dependencies.reduce((pkg, dep) => {
              pkg['devDependencies'][dep.package] = dep.version;

              return pkg;
            }, packageJson);
          });
      })
      .then((result) => {
        console.log("rejuvenated package is now: ", JSON.stringify(result));

        return Promise.resolve();
      });
  }

  private findMostRecent(deps:{[key: string]: string}): Promise<Dependency[]> {

    return Promise.all(
        Object.keys(deps).map((name) => {
          const repo = this.repositories.find((repo) => repo.exists(name));

          if (repo) {
            return repo.findOne(name);
          }
          return null;
        })
        .filter((value) => value !== null)
      );
  }

}
