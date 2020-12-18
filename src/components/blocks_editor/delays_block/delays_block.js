import "./delays_block.scss";
import { Component } from "react";

class DelaysBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modify_delays: [],
    };
  }

  componentDidMount() {
    this.setState({ modify_delays: this.props.delays });
  }

  handleChange = (delay, index) => {
    const modify_delays = this.state.modify_delays.map((i) => {
      if (i.index === index) i.delay = delay;
      return i;
    });
    this.setState({ modify_delays });
    this.props.handleChangeDelays(modify_delays);
  };

  render() {
    const del_elems = this.state.modify_delays.map((elem, index) => {
      return (
        <div className="gif-sq_block-item" key={index}>
          <div>{index}</div>
          <img
            src="https://icongr.am/entypo/image.svg?size=70&color=currentColor"
            alt="111"
            width={"50px"}
          />
          <input
            type="number"
            min="0"
            step="1"
            name="delay"
            defaultValue={this.state.modify_delays[index].delay}
            onChange={(e) => {
              this.handleChange(parseInt(e.target.value), index);
            }}
          />
        </div>
      );
    });

    return <>{del_elems}</>;
  }
}

export default DelaysBlock;
