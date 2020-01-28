import Utilities from './utilities.js'

class Controller {
  static main = null;
  static _frames = {};
  static _framesHandler = {
    set: (...params) => {
      const [target, property, value, receiver] = params;
      const result = Reflect.set(...params);
      // setTimeout(() => {
      //   Controller.renderFrame(value);
      // });
      Controller.renderFrame(value);
      // Controller.renderFrames();
      return result;
    },
    deleteProperty: (...params) => {
      const result = Reflect.deleteProperty(...params);
      // Controller.renderFrames();
      return result;
    }
  }
  
  static frames = new Proxy(Controller._frames, Controller._framesHandler);

  static addFrame(frame) {
    const key = frame.key;
    Controller.frames[key] = frame;
    return key;
  }

  static deleteFrame(frame) {
    delete Controller.frames[frame.key];
  }

  static setMain(main) {
    Controller.main = main;
  }

  static getMain() {
    return Controller.main;
  }

  static renderFrame(frame) {
    Controller.main.appendChild(frame);
    
    requestAnimationFrame(() => {
      Object.entries(Controller._frames).forEach(([,f], idx, array) => {
        if (frame.key === f.key && !f.state.disableClickToFront) f.classList.add('frame-shadow');
        else f.classList.remove('frame-shadow');
      })
    }); 
  }

  static renderFrames() {
    if (Controller.main != null) {
      Object.entries(Controller._frames).forEach(([,frame], idx, array) => {
        if (idx === array.length - 1) frame.frameNode.classList.add('frame-shadow');
        else if (frame.frameNode.classList.contains('frame-shadow'))
          frame.frameNode.classList.remove('frame-shadow');
        Controller.main.appendChild(frame.frameNode); 
      })
    }
  }
}

export default Controller;