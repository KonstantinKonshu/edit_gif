import { Component, PureComponent } from "react";
import "./App.scss";
import SideBar from "../sidebar/sidebar";
import SequenceBlock from "../blocks_editor/sequence_block/sequence_block";
import DelaysBlock from "../blocks_editor/delays_block/delays_block";
import FramesBlock from "../blocks_editor/frames_block/frames_block";

const { ipcRenderer } = require("electron");

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected_file: undefined,
      path: undefined,
      selected_page: undefined,
      positions: [],
      delays: [],
      positions_for_remove: [],
      loops: undefined,
    };
  }

  handleSelectPage = (page) => {
    if (!this.state.selected_file) return null;
    console.log("pap", page);
    if (page !== "Save GIF") this.setState({ selected_page: page });
    else {
      console.log("Saving GIF ....");
      this.saveGIF();
    }
  };

  saveGIF = async () => {
    try {
      const is_save = await ipcRenderer.invoke("SAVE_GIF", this.state);
    } catch (e) {
      console.error(e);
    }
  };

  handleChangeSequence = (selected_positions) => {
    this.setState({ positions: selected_positions });

    console.log(`handleChangeSequence selected:`, selected_positions);
  };

  handleChangeDelays = (delays) => {
    this.setState({ delays });
  };

  handleChangeFrames = (positions_for_remove) => {
    this.setState({ positions_for_remove });
  };

  selectGIFFile = async () => {
    console.log("selectGIFFile --- STATE", this.state);
    try {
      const selected_file = await ipcRenderer.invoke("SELECT_GIF_FILE");
      this.setState({
        path: selected_file.path,
        selected_file,
        loops: selected_file.data.loops,
      });

      selected_file.data.frames.forEach((elem, index) => {
        this.setState({
          positions: [...this.state.positions, { pos1: index, pos2: index }],
          delays: [
            ...this.state.delays,
            { index: index, delay: elem.delayCentisecs },
          ],
          positions_for_remove: [
            ...this.state.positions_for_remove,
            { index: index, is_remove: false },
          ],
        });
      });

      this.setState({ selected_page: "Sequence" });
      console.log(selected_file);
    } catch (e) {
      console.error(e);
    }
  };

  renderInputBlock() {
    return (
      <div className="gif-ib-container">
        <input
          name="path"
          className="cp-ua-auth_form-input_email"
          type="search"
          readOnly
          value={this.state.path}
        />
        <div
          className="cp-ua-auth_form-btn_login"
          onClick={() => {
            this.selectGIFFile();
          }}
        >
          Upload GIF file
        </div>
      </div>
    );
  }

  renderBlock() {
    const {
      selected_page,
      positions,
      delays,
      positions_for_remove,
    } = this.state;
    console.log("selectes page", selected_page);
    if (!selected_page) return undefined;

    if (selected_page === "Sequence")
      return (
        <SequenceBlock
          positions={positions}
          handleChangeSequence={this.handleChangeSequence}
        />
      );
    if (selected_page === "Delays")
      return (
        <DelaysBlock
          delays={delays}
          handleChangeDelays={this.handleChangeDelays}
        />
      );
    if (selected_page === "Frames")
      return (
        <FramesBlock
          positions_for_remove={positions_for_remove}
          handleChangeFrames={this.handleChangeFrames}
        />
      );
    if (selected_page === "Loops")
      return (
          <input
              className="gif-loops-block"
            type="number"
            min="0"
            step="1"
            name="delay"
            defaultValue={this.state.loops}
            onChange={(e) => {
              this.setState({ loops: parseInt(e.target.value) });
            }}
          />
      );
  }

  render() {
    console.log("APP --- STATE", this.state);
    return (
      <div className="gif-container">
        {this.renderInputBlock()}

        <div className="gif-container-wrap">
          <div className="gif-container-left">
            <SideBar handleSelectPage={this.handleSelectPage} />
          </div>
          <div className="gif-container-right">{this.renderBlock()}</div>
        </div>
      </div>
    );
  }
}

export default App;
