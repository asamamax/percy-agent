import {describe} from 'mocha'
import Start from '../../src/commands/start'
import Stop from '../../src/commands/stop'
import * as chai from 'chai'
import {captureStdOut} from '../helpers/stdout'
const expect = chai.expect

describe('Start', () => {
  beforeEach(async () => {
    await captureStdOut(async () => Start.run([]))
  })

  describe('#stop', () => {
    it('stops percy agent gracefully', async () => {
      let stdout = await captureStdOut(async () => {
        await Stop.run([])
      })

      expect(stdout).to.match(/\[info\] gracefully stopping percy-agent\[\d+\]/)
      expect(stdout).to.match(/\[info\] percy-agent\[\d+\] has stopped/)
    })

    it('stops percy agent forcefully', async () => {
      let stdout = await captureStdOut(async () => {
        await Stop.run(['--force'])
      })

      expect(stdout).to.match(/\[info\] forcefully stopping percy-agent\[\d+\]/)
      expect(stdout).to.match(/\[info\] percy-agent\[\d+\] has stopped/)
    })

    it('warns you when percy agent is already stopped', async () => {
      await captureStdOut(async () => {
        await Stop.run([])
      })

      let stdout = await captureStdOut(async () => {
        await Stop.run([])
      })

      expect(stdout).to.match(/\[info\] percy-agent is already stopped/)
    })
  })
})
