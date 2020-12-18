const path = require("path");
const { app, ipcMain, dialog } = require("electron");

const { GifUtil, GifFrame } = require("gifwrap");
const { getWindow } = require("./window.js");

module.exports = () => {
  ipcMain.handle("SELECT_GIF_FILE", async (event) => {
    const select_path_file = await dialog.showOpenDialog(getWindow("main"), {
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["gif"] }],
    });

    const data = await GifUtil.read(select_path_file.filePaths[0]);
    return { path: select_path_file.filePaths[0], data: data };
  });

  ipcMain.handle("SAVE_GIF", async (event, data) => {
    const delays = data.delays;
    const positions = data.positions;
    const positions_for_remove = data.positions_for_remove.filter(
      (i) => i.is_remove
    );
    console.log("positions_for_remove ++++", positions_for_remove);

    // set delays ....
    const frames = data.selected_file.data.frames.map((frame, index) => {
      console.log();
      console.log();
      const width = frame.bitmap.width;
      const height = frame.bitmap.height;
      const data = frame.bitmap.data;
      const delay = delays.find((i) => i.index === index);

      console.log("PARAMS", {
        width: width,
        height: height,
        delay: delay,
        data: data,
      });
      // console.log("data.delays", delays);

      const build_frame = new GifFrame(width, height, frame.bitmap.data, {
        delayCentisecs: delay.delay,
      });

      console.log("build_fr", build_frame);
      build_frame.bitmap.data = Buffer.from(data);
      return build_frame;
    });

    frames.forEach((i, index) => console.log(`frame_${index}`, i.bitmap));
    console.log("FRAMES:", frames);

    //sorting ...
    const sorted_frames = positions.map((i) => {
      console.log();
      console.log();
      return frames[i.pos2];
    });

    console.log("sorting FRAMES:", sorted_frames);

    //deleting frame
    const filtering_frames = sorted_frames.filter((elem, index) => {
      return !positions_for_remove.some((el) => el.index === index);
    });

    filtering_frames.forEach((i, index) =>
      console.log(`filter_frame_${index}`, i.bitmap)
    );

    try {
      GifUtil.write(
        path.dirname(data.path) + "/new-gif.gif",
        filtering_frames,
        {
          loops: data.loops,
        }
      ).threshold;
    } catch (e) {
      console.log("ERR gif", e);
    }

    console.log("new gif");
    return true;
  });
};
