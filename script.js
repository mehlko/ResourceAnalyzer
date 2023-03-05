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
  constructor(props) {
    super(props);
    this.state = { processModel: '', functions2: ['halllo', 'yuhu'] };

    this.handleProcessModelChange = this.handleProcessModelChange.bind(this);
  }

  handleProcessModelChange(xmlDoc) {
    this.setState({ processModel: xmlDoc }, () => {
      this.analyze();
    });
  }

  async analyze() {
    var xmlDoc = this.state.processModel;
    log(xmlDoc);
    var sequenceFlows = xmlDoc.getElementsByTagNameNS(
      'http://www.omg.org/spec/BPMN/20100524/MODEL',
      'sequenceFlow'
    );
    const sequenceFlowMapSource = new Map();
    for (let sequenceFlow of sequenceFlows) {
      sequenceFlowMapSource.set(
        sequenceFlow.getAttribute('sourceRef'),
        sequenceFlow
      );
    }
    var associations = xmlDoc.getElementsByTagNameNS(
      'http://www.omg.org/spec/BPMN/20100524/MODEL',
      'association'
    );
    const associationMapSource = new Map();
    for (let association of associations) {
      associationMapSource.set(
        association.getAttribute('sourceRef'),
        association
      );
    }
    var textAnnotations = xmlDoc.getElementsByTagNameNS(
      'http://www.omg.org/spec/BPMN/20100524/MODEL',
      'textAnnotation'
    );
    const textAnnotationMap = new Map();
    for (let textAnnotation of textAnnotations) {
      textAnnotationMap.set(textAnnotation.getAttribute('id'), textAnnotation);
    }

    //calulate path
    var path = [];
    var startEvents = xmlDoc.getElementsByTagNameNS(
      'http://www.omg.org/spec/BPMN/20100524/MODEL',
      'startEvent'
    );
    for (let startEvent of startEvents) {
      path = [];
      var currentId = startEvent.getAttribute('id');
      while (sequenceFlowMapSource.has(currentId)) {
        path.push(currentId);
        currentId = sequenceFlowMapSource
          .get(currentId)
          .getAttribute('targetRef');
        sequenceFlowMapSource.get(currentId);
      }
      path.push(currentId);
    }
    log('test');
    log(path);

    for (let step of path) {
      log(step);
      if (associationMapSource.has(step)) {
        var association = associationMapSource.get(step);
        var target = association.getAttribute('targetRef');

        if (textAnnotationMap.has(target)) {
          var text = textAnnotationMap
            .get(target)
            .getElementsByTagNameNS(
              'http://www.omg.org/spec/BPMN/20100524/MODEL',
              'text'
            )[0].innerHTML;
          if (text.startsWith('Requires:')) {
            text = text.replace('Requires:', '');
            var splitted = text.split(',');
            for (let s of splitted) {
              log(s.trim());
              await this.setState({
                functions2: [...this.state.functions2, s.trim()],
              });
            }
            log(splitted);
          }
        }
      }
    }
  }

  render() {
    log(this.state);
    return (
      <div>
        <h1>Model</h1>
        <Process
          onChangeModel={this.handleProcessModelChange}
          url="https://mehlko.github.io/ResourceAnalyzer/models/example1.bpmn"
        />
        {this.state.functions2.map((fn) => (
          <li key={fn}>{fn}</li>
        ))}
        <Function2 />
        <Realization />
        <Resource />
      </div>
    );
  }
}
const container = document.getElementById('container');
ReactDOM.createRoot(container).render(<Model />);
