'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const makeWebpackMock = require('./webpack.mock');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const expect = chai.expect;

const compiler = require('../lib/compiler');

describe('compiler', () => {
  let sandbox;
  let webpackMock;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.usingPromise(BbPromise);

    webpackMock = makeWebpackMock(sandbox);

    mockery.enable({ warnOnUnregistered: false });
    mockery.registerMock('webpack', webpackMock);
  });

  after(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  afterEach(() => {
    // This will reset the webpackMock too
    sandbox.restore();
  });

  it('should expose a `compiler` method', () => {
    expect(compiler.compiler).to.be.a('function');
  });

  it('should compile with webpack from a context configuration', () => {
    const testWebpackConfig = { entry: 'test' };
    const testConsoleStats = {};
    return expect(compiler.compiler(testWebpackConfig, testConsoleStats)).to.be.fulfilled.then(() => {
      expect(webpackMock).to.have.been.calledWith(testWebpackConfig);
      expect(webpackMock.compilerMock.run).to.have.been.calledOnce;
      return null;
    });
  });
});
