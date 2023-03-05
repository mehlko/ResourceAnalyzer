class Process extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.containerRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
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

    //event listener
    this.bpmnViewer
      .get('eventBus')
      .on('element.changed', (e) => this.handleChange(e));
    this.bpmnViewer
      .get('eventBus')
      .on('import.done', (e) => this.handleChange(e));

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

  async componentDidUpdate(prevProps, prevState) {
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

  handleClick(e) {
    e.preventDefault();
    this.analyze();
  }

  async handleChange(event) {
    var xml = await this.bpmnViewer._moddle.toXML(this.bpmnViewer._definitions);
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml.xml, 'text/xml');
    this.props.onChangeModel(xmlDoc);
  }

  render() {
    return (
      <div>
        <div
          id="bpmn"
          className="react-bpmn-diagram-container"
          ref={this.containerRef}
        ></div>
        <Button onClick={this.handleClick} variant="outlined">
          Analyze
        </Button>
      </div>
    );
  }
}