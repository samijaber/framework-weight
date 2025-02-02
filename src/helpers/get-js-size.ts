export type NetworkRequestItem = {
  url: string;
  transferSize: number;
  resourceType: string;
};

/**
 * From a lighthouse report, get the size of all JS requested
 *
 * @param {LighthouseReport} report - lighthouse report
 * @returns {number} - size of all JS requested in kb
 */
export function getJsSize(report: LH.Result) {
  const jsBytes = (
    (report.audits['network-requests'] as any).details
      .items as NetworkRequestItem[]
  )
    .filter((item) => item.resourceType === 'Script')
    .reduce((acc, item) => acc + item.transferSize, 0);

  return Math.round(jsBytes / 1000);
}
