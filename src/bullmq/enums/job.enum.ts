/** Enumerates the list of available jobs to be added to a queue */
export enum JobEnum {
  /** Runs the job with cheerio crawler */
  CHEERIO = 'cheerio',

  /** Runs the job with puppeteer crawler */
  PUPPETEER = 'puppeteer',
}
