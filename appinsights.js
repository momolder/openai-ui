import { setup, DistributedTracingModes, start } from 'applicationinsights';
// import { config } from 'dotenv';

function setupAppInsights() {
  if (process.env.PUBLIC_AppInsights_Endpoint) {
    // config();
    setup(process.env.PUBLIC_AppInsights_Endpoint)
      .setAutoCollectConsole(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectHeartbeat(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectRequests(true)
      .setAutoDependencyCorrelation(true)
      .setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C)
      .setSendLiveMetrics(true)
      .setUseDiskRetryCaching(true);
    start();
  }
}

export default setupAppInsights();
