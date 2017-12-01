
/** A build command instructed to be run for a project. */
export interface Command {

  run(): Promise<void>;
}
