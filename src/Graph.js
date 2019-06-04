import Graph from "react-graph-vis";
import React, { Component } from "react";
import { getQuery } from "./RestQuerier";
import { Popover } from "antd";
import _ from "lodash";

const options = {
  autoResize: true,
  height: "100%",
  width: "100%",
  layout: {
    hierarchical: {
      enabled: false,
      nodeSpacing: 35,
      treeSpacing: 35,
      blockShifting: false,
      edgeMinimization: false,
      parentCentralization: false,
      sortMethod: "directed"
    }
  },
  nodes: {
    shape: "box",
    color: "#6db33f"
  },
  physics: {
    enabled: false
  }
};

class AtlasGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: { nodes: [], edges: [] },
      visible: false
    };
  }

  // this is a mess arghhhh
  getNodes = () => {
    let nodes = [];
    let edges = [];
    getQuery("beans").then(r => {
      const contexts = r.contexts;
      const singleContext = contexts[Object.keys(contexts)];
      const beans = singleContext.beans;

      const beanArray = _.map(beans, (val, id) => {
        return { ...val, name: id };
      });

      beanArray.forEach((bean, idx) => {
        //   if (bean.name.includes("datastore")) {
        nodes.push({ id: bean.name, label: bean.name });
        bean.dependencies.forEach(d => {
          edges.push({ from: bean.name, to: d });
        });
        //    }
      });
      this.setState({
        beans,
        graph: {
          nodes,
          edges
        }
      });
      //   });
    });
  };

  getEvents = () => {
    const select = event => {
      const { nodes } = event;
      if (nodes.length === 1) {
        const selectedBeanInfo = this.state.beans[nodes];
        this.handleVisibleChange(nodes, selectedBeanInfo);
      }
      console.log(nodes);

      //    alert(`Name: ${nodes}, Scope: ${this.state.beans[nodes]['scope']}`);
    };
    const events = { select };
    return events;
  };

  openDrawer = beanName => {
    this.setState({ beanName });
  };

  componentDidMount() {
    this.getNodes();
  }

  hide = () => {
    this.setState({
      visible: false
    });
  };

  handleVisibleChange = (selectedBeanName, selectedBeanInfo) => {
    this.setState({ visible: true, selectedBeanName, selectedBeanInfo });
  };

  render() {
    return (
      <div className="graph">
        <Popover
          content={
            this.state.selectedBeanName !== undefined ? (
              <div onClick={this.hide}>
                <p>Scope: {this.state.selectedBeanInfo.scope}</p>
                <p>
                  Dependencies:{" "}
                  {JSON.stringify(this.state.selectedBeanInfo.dependencies)}
                </p>
              </div>
            ) : (
              <p>Click a bean to see details</p>
            )
          }
          title={this.state.selectedBeanName}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          {this.state.graph.nodes.length > 0 ? (
            <Graph
              graph={this.state.graph}
              options={options}
              events={this.getEvents()}
            />
          ) : (
            <p>Loading</p>
          )}
        </Popover>
      </div>
    );
  }
}

export default AtlasGraph;
