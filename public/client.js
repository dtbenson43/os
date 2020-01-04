class Utilities {
  static uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }  
}

class Frame {
  static _frameHandler

  static getTitleNode(frame) {
    return frame 
      ? frame.frameNode.getElementsByClassName('frame-title')[0]
      : undefined;
  }

  static getBodyNode(frame) {
    return frame 
      ? frame.frameNode.getElementsByClassName('frame-body')[0]
      : undefined;
  }

  static getStatusNode(frame) {
    return frame 
      ? frame.frameNode.getElementsByClassName('frame-status')[0]
      : undefined;
  }

  static disableTitleNode(frame) {
    const titleNode = this.getTitleNode(frame);
    if (titleNode) {
      frame.frameNode.removeChild(titleNode);
      const bodyNode = this.getBodyNode(frame);
      if (bodyNode) {
        const statusNode = this.getStatusNode(frame);
        if (statusNode) bodyNode.style.height = 'calc(100% - 24px)';
        else bodyNode.style.height = '100%';
      }
    }
  }
 
  static enableTitleNode(frame) {
    const titleNode = document.createElement('div');
    titleNode.className = 'frame-title';
    frame.frameNode.prepend(titleNode);
    const bodyNode = this.getBodyNode(frame);
    if (bodyNode) {
      const statusNode = this.getStatusNode(frame);
      if (statusNode) bodyNode.style.height = 'calc(100% - 48px)';
      else bodyNode.style.height = 'calc(100% - 24px)';
    }
  }

  static disableStatusNode(frame) {
    const statusNode = this.getStatusNode(frame);
    if (statusNode) {
      frame.frameNode.removeChild(statusNode);
      const bodyNode = this.getBodyNode(frame);
      if (bodyNode) {
        const titleNode = this.getTitleNode(frame);
        if (titleNode) bodyNode.style.height = 'calc(100% - 24px)';
        else bodyNode.style.height = '100%';
      }
    }
  }
 
  static enableStatusNode(frame) {
    const statusNode = document.createElement('div');
    statusNode.className = 'frame-title';
    const bodyNode = this.getBodyNode(frame);
    if (bodyNode) {
      frame.frameNode.insertBefore(statusNode, bodyNode.nextSibling);
      const titleNode = this.getTitleNode(frame);
      if (titleNode) bodyNode.style.height = 'calc(100% - 48px)';
      else bodyNode.style.height = 'calc(100% - 24px)';
    }
  }

  static enableFrameDraggable(frame) {
    frame
  }

  static disableTitle(frame) {
    frame
  }

  static createFrame(options) {
    options = options ? options : {};
    const {
      disableTitle,
      disableStatus,
     } = options;
 
    // build DOM structure
    const frameNode = document.createElement('div');
    const frameBody = document.createElement('div');
    const frameTitle = document.createElement('div');
    const frameStatus = document.createElement('div');

    frameNode.appendChild(frameTitle);
    frameNode.appendChild(frameBody);
    frameNode.appendChild(frameStatus);

    // set up styles
    frameNode.className = 'frame';
    frameBody.className = 'frame-body';
    frameTitle.className = 'frame-title';
    frameStatus.className = 'frame-status';
    frameBody.style.height = 'calc(100% - 48px)';

    // set up frame object
    const _frame = { frameNode };

    const frame = new Proxy(_frame, {
      set: (...params) => {
        const [target, property, value, receiver] = params;
        const result = Reflect.set(...params);
        switch(property) {
          case 'x':
            console.log(property, value);
            frameNode.style.left = `${value}px`;
            break;
          case 'y':
            frameNode.style.top = `${value}px`;
            break;
          case 'height':
            frameNode.style.height = `${value}px`;
            break;
          case 'width':
            frameNode.style.width = `${value}px`;
            break;
        }
        return result;
      }
    });

    Object.assign(frame, options);

    // set up actions
    frameTitle.onmousedown = () => {};

    if (disableTitle) Frame.disableTitleNode(frame);
    if (disableStatus) Frame.disableStatusNode(frame);
    return frame;
  }

  static setTitle(frame, title) {
    const titleBar = this.getTitleNode(frame);
    if(titleBar) titleBar[0].innerText = title;
  }
}

class Controller {
  main = null;
  static _frames = {};
  static _framesHandler = {
    set: (...params) => {
      const result = Reflect.set(...params);
      if (this.main != null) {
        while(this.main.firstChild) {
          this.main.removeChild(main.firstChild);
        }
        Object.entries(this._frames).forEach(([,frame]) => this.main.appendChild(frame.frameNode));  
      }
      return result;
    }
  }
  
  static frames = new Proxy(this._frames, this._framesHandler);

  static addFrame(frame) {
    const key = Utilities.uuidv4();
    frame.key = key;
    this.frames[key] = frame;
    return key;
  }

  static setMain(main) {
    this.main = main;
  }

  static getMain() {
    return this.main;
  }
}

const main = document.getElementById('main');
Controller.setMain(main);
const temp = Frame.createFrame({ x: 20, y: 200, height: 200, width: 200 });
console.log(temp);
Controller.addFrame(temp);