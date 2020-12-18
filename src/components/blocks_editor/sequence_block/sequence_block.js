import "./sequence_block.scss";
import { Component } from "react";
import Select from "react-select";

class SequenceBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_positions: [],
      options: [],
    };
  }

  componentDidMount() {
    this.setState({ selected_positions: this.props.positions });
    const options = this.props.positions.map((i, index) => {
      return { value: index, label: index };
    });

    this.setState({ options });
  }

  handleChange = (selectedOption, index) => {
    console.log("handle Select", {
      index: index,
      selectedOption: selectedOption,
    });
    const selected_positions = this.state.selected_positions.map((i) => {
      if (i.pos1 === index) {
        i.pos2 = selectedOption;
      }
      return i;
    });
    this.setState({ selected_positions });
    this.props.handleChangeSequence(selected_positions);

    console.log(`Option selected:`, selected_positions);
  };

  render() {
    const { selected_positions, options } = this.state;
    const seq_elems = selected_positions.map((elem, index) => {
      return (
        <div className="gif-sq_block-item" key={index}>
          <div>{index}</div>
          <img
            src="https://icongr.am/entypo/image.svg?size=70&color=currentColor"
            alt="111"
            width={"50px"}
          />
          <Select
            value={options[selected_positions[index].pos2]}
            onChange={(selectedOption) => {
              this.handleChange(selectedOption.label, index);
            }}
            options={options}
          />
        </div>
      );
    });

    return <>{seq_elems}</>;
  }
}

export default SequenceBlock;
