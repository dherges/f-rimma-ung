/*
# Finds the latest buid / release from Angular's GitHub build repo
$ GIT_URL=https://github.com/angular/common-builds.git

$ HEAD=$(git ls-remote ${GIT_URL} | head -1 | awk '{ print $1 }')
$ echo $HEAD
f161e782ab867d5c3ef61c33f55b3bdbcb97840b

$ TAG=$(git ls-remote ${GIT_URL} | grep $HEAD | grep -oEi "refs/tags/.*" | sed "s/refs\/tags\/\(.*\)/\1/")
$ echo $TAG
5.1.0-beta.1+0444e13

*/
import * as shell from 'shelljs';
import { Dependency } from './dependency';
import { ReleaseRepository } from './release.repository';

const REPOS = {
  '@angular/animations': {
    url: 'https://github.com/angular/animations-builds.git',
  },
  '@angular/bazel': {
    url: 'https://github.com/angular/bazel-builds.git'
  },
  '@angular/benchpress': {
    url: 'https://github.com/angular/benchpress-builds.git'
  },
  '@angular/common': {
    url: 'https://github.com/angular/common-builds.git'
  },
  '@angular/compiler-cli': {
    url: 'https://github.com/angular/compiler-cli-builds.git'
  },
  '@angular/compiler': {
    url: 'https://github.com/angular/compiler-builds.git'
  },
  '@angular/core': {
    url: 'https://github.com/angular/core-builds.git'
  },
  '@angular/forms': {
    url: 'https://github.com/angular/forms-builds.git'
  },
  '@angular/http': {
    url: 'https://github.com/angular/http-builds.git'
  },
  '@angular/language-service': {
    url: 'https://github.com/angular/language-service-builds.git'
  },
  '@angular/material2': {
    url: 'https://github.com/angular/material2-builds.git'
  },
  '@angular/platform-browser-dynamic': {
    url: 'https://github.com/angular/platform-browser-dynamic-builds.git'
  },
  '@angular/platform-browser': {
    url: 'https://github.com/angular/platform-browser-builds.git'
  },
  '@angular/platform-server': {
    url: 'https://github.com/angular/platform-server-builds.git'
  },
  '@angular/platform-webworker-dynamic': {
    url: 'https://github.com/angular/platform-webworker-dynamic-builds.git'
  },
  '@angular/platform-webworker': {
    url: 'https://github.com/angular/platform-webworker-builds.git'
  },
  '@angular/router': {
    url: 'https://github.com/angular/router-builds.git'
  },
  '@angular/service-worker': {
    url: 'https://github.com/angular/service-worker-builds.git'
  },
  '@angular/upgrade': {
    url: 'https://github.com/angular/upgrade-builds.git'
  },
};


export class AngularGithubReleasesRepository implements ReleaseRepository {

  public exists(packageName: string): boolean {

    return Object.keys(REPOS)
      .some((key) => key === packageName);
  }

  public findOne(packageName: string): Promise<Dependency> {
    const REPO = REPOS[packageName];

    if (REPO.version) {
      return Promise.resolve({
        package: packageName,
        version: REPO.version
      });
    }

    return new Promise((resolve, reject) => {

      if (REPO) {
        const GIT_URL = REPO.url;
        const COMMAND = `HEAD=$(git ls-remote ${GIT_URL} | head -1 | awk '{ print $1 }') \\
          && TAG=$(git ls-remote ${GIT_URL} | grep $HEAD | grep -oEi "refs/tags/.*" | sed "s/refs\\/tags\\/\\(.*\\)/\\1/") \\
          && echo $TAG`;

        shell.exec(COMMAND, { async: true, silent: true }, (code, out, err) => {
          if (err) {
            reject(err);
          }

          REPO.version = `${GIT_URL}#${out.trim()}`;

          resolve({
            package: packageName,
            version: REPO.version
          });
        });

      } else {
        reject(`Repository does not contain releaese information for package ${packageName}`);
      }
    });
  }

}
