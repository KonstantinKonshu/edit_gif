import "./frames_block.scss";
import { Component } from "react";

class FramesBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modify_positions: [],
    };
  }

  componentDidMount() {
    this.setState({ modify_positions: this.props.positions_for_remove });
  }

  handleChange = (is_remove, index) => {
    const modify_positions = this.state.modify_positions.map((i) => {
      if (i.index === index) i.is_remove = !i.is_remove;
      return i;
    });

    this.setState({ modify_positions });
    this.props.handleChangeFrames(modify_positions);
  };

  render() {
    console.log("SequenceBlock", this.props);
    const fr_elems = this.state.modify_positions.map((elem, index) => {
      return (
        <div className="gif-sq_block-item" key={index}>
          <div>{index}</div>
          <img
            src="https://icongr.am/entypo/image.svg?size=70&color=currentColor"
            alt="111"
            width={"50px"}
          />
          <input
            type="checkbox"
            name="frame"
            checked={elem.is_remove}
            onChange={(e) => {
              this.handleChange(e.target.value, index);
            }}
          />
        </div>
      );
    });

    return <>{fr_elems}</>;
  }
}

export default FramesBlock;
