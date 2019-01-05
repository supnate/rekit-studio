import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from 'react-split-pane/lib/Pane';
import { Button } from 'antd';
import { storage } from '../common/utils';
import { listAllTest, clearTestList, removeTestFromList } from './redux/actions';
import { TestList } from './';
import { TestResult } from './';

export class TestPanel extends Component {
  static propTypes = {
    pluginTest: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getSizesState() {
    return storage.local.getItem('layoutSizes') || {};
  }

  getTests() {
    const { testList } = this.props.pluginTest;
    return testList.map(s => ({ name: s }));
  }

  handleResizeEnd = (paneId, sizes) => {
    const sizesState = this.getSizesState();
    sizesState[paneId] = sizes;
    storage.local.setItem('layoutSizes', sizesState);
  };

  handleRunAll = () => {
    const { elementById, actions } = this.props;
    actions.listAllTest(Object.values(elementById));
  };

  renderToolbar() {
    const tests = this.getTests();
    return (
      <div className="test-panel-toolbar">
        <Button
          icon="caret-right"
          ghost
          size="small"
          title="Run all tests in the project."
          className="btn-run-all"
          onClick={this.handleRunAll}
        >
          Run all
        </Button>
        <Button
          icon="caret-right"
          ghost
          size="small"
          className="btn-run-list"
          title="Run all tests in below list."
        >
          Run list
        </Button>
        <Button
          icon="caret-right"
          ghost
          size="small"
          className="btn-run-failed"
          title="Run tests failed during last run."
        >
          Run failed (5)
        </Button>
        <Button
          icon="close"
          ghost
          size="small"
          className="btn-clear-list"
          title="Clear tests in the list."
          onClick={this.props.actions.clearTestList}
        >
          Clear list
        </Button>
        <span className="result-summary">
          <span className="error-text">26 failed</span>{' '}
          <span className="success-text">156 passed</span> {tests.length} total.
        </span>
      </div>
    );
  }
  render() {
    const sizes = this.getSizesState()['plugin-test-panel'] || [];

    const tests = this.getTests();
    return (
      <div className="plugin-test-test-panel">
        {this.renderToolbar()}
        <SplitPane
          onResizeEnd={sizes => this.handleResizeEnd('plugin-test-panel', sizes)}
          className="split-pane"
        >
          <Pane minSize="100px" maxSize="80%" size={sizes[0] || '300px'}>
            <TestList tests={tests} status={{}} />
          </Pane>
          <Pane className="output-container" size={sizes[1] || 1}>
            <TestResult />
          </Pane>
        </SplitPane>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pluginTest: state.pluginTest,
    elementById: state.home.elementById,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ listAllTest, clearTestList, removeTestFromList }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestPanel);
