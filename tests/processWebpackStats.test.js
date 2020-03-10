'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const path = require('path');
const chai = require('chai');
const sinon = require('sinon');

const processWebpackStats = require('../lib/processWebpackStats');

class ChunkMock {
  constructor(modules) {
    this.modules = modules;
    this._modules = modules;
  }

  get modulesIterable() {
    return this._modules;
  }
}

class ChunkMockNoModulesIterable {
  constructor(modules) {
    this._modules = modules;
  }
}

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const expect = chai.expect;

describe('processsWebpackStats', () => {
  describe('processsWebpackStats()', () => {
    it('should convert chunks', () => {
      const testOutputPath = '/my/Service/Path/.webpack/service';
      const testCliOutput = 'out';
      const jsonStats = {
        errors: [],
        outputPath: testOutputPath
      };
      const testStats = {
        compilation: {
          chunks: [
            new ChunkMock([
              {
                identifier: _.constant('"crypto"')
              },
              {
                identifier: _.constant('"uuid/v4"')
              },
              {
                identifier: _.constant('"mockery"')
              },
              {
                identifier: _.constant('"@scoped/vendor/module1"')
              },
              {
                identifier: _.constant('external "@scoped/vendor/module2"')
              },
              {
                identifier: _.constant('external "uuid/v4"')
              },
              {
                identifier: _.constant('external "bluebird"')
              }
            ]),
            new ChunkMockNoModulesIterable([])
          ],
          compiler: {
            outputPath: testOutputPath
          }
        },

        toJson: sinon.stub().returns(jsonStats),
        toString: sinon.stub().returns(testCliOutput)
      };
      const testConsoleOptions = 'minimal';
      const stats = processWebpackStats.processWebpackStats(testStats, testConsoleOptions);

      expect(stats).to.eql({
        cliOutput: testCliOutput,
        outputPath: testOutputPath,
        errors: [],
        externalModules: [
          {
            external: '@scoped/vendor',
            origin: undefined
          },
          {
            external: 'uuid',
            origin: undefined
          },
          {
            external: 'bluebird',
            origin: undefined
          }
        ]
      });
    });

    it('should convert chunks with no externals', () => {
      const testOutputPath = '/my/Service/Path/.webpack/service';
      const testCliOutput = 'out';
      const jsonStats = {
        errors: [],
        outputPath: testOutputPath
      };
      const testNoExtStats = {
        compilation: {
          chunks: [
            new ChunkMock([
              {
                identifier: _.constant('"crypto"')
              },
              {
                identifier: _.constant('"uuid/v4"')
              },
              {
                identifier: _.constant('"mockery"')
              },
              {
                identifier: _.constant('"@scoped/vendor/module1"')
              }
            ])
          ],
          compiler: {
            outputPath: testOutputPath
          }
        },

        toJson: sinon.stub().returns(jsonStats),
        toString: sinon.stub().returns(testCliOutput)
      };

      const testConsoleOptions = 'minimal';
      const stats = processWebpackStats.processWebpackStats(testNoExtStats, testConsoleOptions);

      expect(stats).to.eql({
        cliOutput: testCliOutput,
        outputPath: testOutputPath,
        errors: [],
        externalModules: []
      });
    });

    const statsWithFileRef = {
      stats: [
        {
          compilation: {
            chunks: [
              new ChunkMock([
                {
                  identifier: _.constant('"crypto"')
                },
                {
                  identifier: _.constant('"uuid/v4"')
                },
                {
                  identifier: _.constant('"mockery"')
                },
                {
                  identifier: _.constant('"@scoped/vendor/module1"')
                },
                {
                  identifier: _.constant('external "@scoped/vendor/module2"')
                },
                {
                  identifier: _.constant('external "uuid/v4"')
                },
                {
                  identifier: _.constant('external "localmodule"')
                },
                {
                  identifier: _.constant('external "bluebird"')
                }
              ])
            ],
            compiler: {
              outputPath: '/my/Service/Path/.webpack/service'
            }
          }
        }
      ]
    };

    const statsWithDevDependency = {
      stats: [
        {
          compilation: {
            chunks: [
              new ChunkMock([
                {
                  identifier: _.constant('"crypto"')
                },
                {
                  identifier: _.constant('"uuid/v4"')
                },
                {
                  identifier: _.constant('external "eslint"')
                },
                {
                  identifier: _.constant('"mockery"')
                },
                {
                  identifier: _.constant('"@scoped/vendor/module1"')
                },
                {
                  identifier: _.constant('external "@scoped/vendor/module2"')
                },
                {
                  identifier: _.constant('external "uuid/v4"')
                },
                {
                  identifier: _.constant('external "localmodule"')
                },
                {
                  identifier: _.constant('external "bluebird"')
                }
              ])
            ],
            compiler: {
              outputPath: '/my/Service/Path/.webpack/service'
            }
          }
        }
      ]
    };

    const statsWithIgnoredDevDependency = {
      stats: [
        {
          compilation: {
            chunks: [
              new ChunkMock([
                {
                  identifier: _.constant('"crypto"')
                },
                {
                  identifier: _.constant('"uuid/v4"')
                },
                {
                  identifier: _.constant('"mockery"')
                },
                {
                  identifier: _.constant('"@scoped/vendor/module1"')
                },
                {
                  identifier: _.constant('external "@scoped/vendor/module2"')
                },
                {
                  identifier: _.constant('external "uuid/v4"')
                },
                {
                  identifier: _.constant('external "localmodule"')
                },
                {
                  identifier: _.constant('external "bluebird"')
                },
                {
                  identifier: _.constant('external "aws-sdk"')
                }
              ])
            ],
            compiler: {
              outputPath: '/my/Service/Path/.webpack/service'
            }
          }
        }
      ]
    };

    const peerDepStats = {
      stats: [
        {
          compilation: {
            chunks: [
              new ChunkMock([
                {
                  identifier: _.constant('"crypto"')
                },
                {
                  identifier: _.constant('"uuid/v4"')
                },
                {
                  identifier: _.constant('"mockery"')
                },
                {
                  identifier: _.constant('"@scoped/vendor/module1"')
                },
                {
                  identifier: _.constant('external "bluebird"')
                },
                {
                  identifier: _.constant('external "request-promise"')
                }
              ])
            ],
            compiler: {
              outputPath: '/my/Service/Path/.webpack/service'
            }
          }
        }
      ]
    };
  });
});
