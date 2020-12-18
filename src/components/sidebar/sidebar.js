import "./sidebar.css";
import { Component } from "react";

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: ["Sequence", "Delays", "Frames", "Loops", "Save GIF"],
    };
  }

  render() {
    const btns = this.state.menu.map((elem, index) => {
      return (
        <div
          key={index}
          className="cp-ua-auth_form-btn_login"
          onClick={() => {
            this.props.handleSelectPage(elem);
          }}
        >
          {elem}
        </div>
      );
    });

    return <>{btns}</>;
  }
}

export default SideBar;
