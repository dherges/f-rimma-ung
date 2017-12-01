import { AngularGithubReleasesRepository } from './releases/angular-github-releases.repository';
import { RejuvenateCommand } from './project/rejuvenate.command';


let foo = new AngularGithubReleasesRepository();
foo.findOne('@angular/common')
  .then((result) => {
    console.log(result.package, result.version);
  })

let rejuvenate = new RejuvenateCommand(
  [ foo ],
  '/Users/David/Projects/github/dherges/ng-packagr/integration/consumers/ng-cli'
);
rejuvenate.run()
  .then(() => {
    console.log('Rejuvenated!')
  });
