//models are here: https://github.com/mehlko/model/

const logLevel = 1;

function log(text) {
  console.log(text);
}
function info(text) {
  if (logLevel) {
    console.log(text);
  }
}

const {
  Button,
  Alert,
  Autocomplete,
  TextField,
  createFilterOptions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Grid,
  Item,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TabPanel,
  TabContext,
  TabList,
} = MaterialUI;

class Process extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.containerRef = React.createRef();
  }

  componentDidMount() {
    const { url, diagramXML } = this.props;

    const container = this.containerRef.current;

    this.bpmnViewer = new BpmnJS({ container });

    this.bpmnViewer.on('import.done', (event) => {
      const { error, warnings } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnViewer.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });

    if (url) {
      return this.fetchDiagram(url);
    }

    if (diagramXML) {
      return this.displayDiagram(diagramXML);
    }
  }

  componentWillUnmount() {
    this.bpmnViewer.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }

    const currentXML = props.diagramXML || state.diagramXML;

    const previousXML = prevProps.diagramXML || prevState.diagramXML;

    if (currentXML && currentXML !== previousXML) {
      return this.displayDiagram(currentXML);
    }
  }

  displayDiagram(diagramXML) {
    this.bpmnViewer.importXML(diagramXML);
  }

  fetchDiagram(url) {
    this.handleLoading();

    fetch(url)
      .then((response) => response.text())
      .then((text) => this.setState({ diagramXML: text }))
      .catch((err) => this.handleError(err));
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }

  render() {
    return (
      <div
        className="react-bpmn-diagram-container"
        ref={this.containerRef}
      ></div>
    );
  }
}

class Realization extends React.Component {
  render() {
    return (
      <div>
        <h1>Realization</h1>
      </div>
    );
  }
}
class Function2 extends React.Component {
  render() {
    return (
      <div>
        <h1>Function</h1>
      </div>
    );
  }
}
class Resource extends React.Component {
  render() {
    return (
      <div>
        <h1>Resource</h1>
      </div>
    );
  }
}

class Model extends React.Component {
  render() {
    return (
      <div>
        <h1>Model</h1>
        <Process
          url="https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/modeler/resources/newDiagram.bpmn"
          onLoading={log}
        />
        <Function2 />
        <Realization />
        <Resource />
      </div>
    );
  }
}
const container = document.getElementById('container');
ReactDOM.createRoot(container).render(<Model />);


