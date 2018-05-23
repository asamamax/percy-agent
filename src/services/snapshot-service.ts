import PercyClientService from './percy-client-service'
import RequestService from './request-service'
import logger, {logError} from '../utils/logger'

export default class SnapshotService extends PercyClientService {
  buildId: number

  constructor(buildId: number) {
    super()

    this.buildId = buildId
  }

  async createSnapshot(
    name: string,
    rootResourceUrl: string,
    domSnapshot: string = '',
    requestManifest: string[] = [],
    enableJavaScript: boolean = false,
    widths: number[] = [1280],
    minimumHeight: number = 500,
  ): Promise<any> {
    logger.info(`creating snapshot '${name}'...`)

    let rootResource = this.percyClient.makeResource({
      resourceUrl: rootResourceUrl,
      content: domSnapshot,
      isRoot: true,
      mimetype: 'text/html',
    })

    let resources = [rootResource]

    if (requestManifest) {
      let requestService = new RequestService()
      logger.info('processing manifest')

      let requestResources = await requestService.processManifest(requestManifest)
      logger.info('processing manifest - done')

      resources = resources.concat(requestResources)
    }

    let response = await this.percyClient.createSnapshot(
      this.buildId, resources, {name, widths, enableJavaScript, minimumHeight}
    ).then((response: any) => {
      return response
    }).catch(logError)

    let snapshotResponse = {
      buildId: this.buildId,
      response,
      resources
    }

    return snapshotResponse
  }

  async finalizeSnapshot(snapshotId: number): Promise<boolean> {
    logger.debug('finalizing snapshot: ' + snapshotId)

    try {
      await this.percyClient.finalizeSnapshot(snapshotId)
      logger.info('finalized snapshot.')
      return true
    } catch (error) {
      logError(error)
      return false
    }
  }
}
