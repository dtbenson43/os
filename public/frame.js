import Controller from './controller.js'

class Frame {
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
    const titleNode = Frame.getTitleNode(frame);
    if (titleNode) {
      frame.frameNode.removeChild(titleNode);
      const bodyNode = Frame.getBodyNode(frame);
      if (bodyNode) {
        const statusNode = Frame.getStatusNode(frame);
        if (statusNode) bodyNode.style.height = 'calc(100% - 24px)';
        else bodyNode.style.height = '100%';
      }
    }
  }
 
  static enableTitleNode(frame) {
    const titleNode = document.createElement('div');
    titleNode.className = 'frame-title';
    frame.frameNode.prepend(titleNode);
    const bodyNode = Frame.getBodyNode(frame);
    if (bodyNode) {
      const statusNode = Frame.getStatusNode(frame);
      if (statusNode) bodyNode.style.height = 'calc(100% - 48px)';
      else bodyNode.style.height = 'calc(100% - 24px)';
    }
  }

  static disableStatusNode(frame) {
    const statusNode = Frame.getStatusNode(frame);
    if (statusNode) {
      frame.frameNode.removeChild(statusNode);
      const bodyNode = Frame.getBodyNode(frame);
      if (bodyNode) {
        const titleNode = Frame.getTitleNode(frame);
        if (titleNode) bodyNode.style.height = 'calc(100% - 24px)';
        else bodyNode.style.height = '100%';
      }
    }
  }
 
  static enableStatusNode(frame) {
    const statusNode = document.createElement('div');
    statusNode.className = 'frame-status';
    const bodyNode = Frame.getBodyNode(frame);
    if (bodyNode) {
      frame.frameNode.insertBefore(statusNode, bodyNode.nextSibling);
      const titleNode = Frame.getTitleNode(frame);
      if (titleNode) bodyNode.style.height = 'calc(100% - 48px)';
      else bodyNode.style.height = 'calc(100% - 24px)';
    }
  }
  
  static enableDrag(frame) {
    const { frameNode } = frame;
    const titleNode = Frame.getTitleNode(frame);
    if (titleNode) {
      titleNode.onmousedown = (e) => {
        e.preventDefault();
        let xPrevious = e.clientX;
        let yPrevious = e.clientY;

        const mouseMoveHandler = (e) => {
          frame.x = frame.x + e.clientX - xPrevious;
          frame.y = frame.y + e.clientY - yPrevious;
          xPrevious = e.clientX;
          yPrevious = e.clientY;
        }

        const removeHandler = () => {
          Controller.main.removeEventListener('mousemove', mouseMoveHandler);
          Controller.main.removeEventListener('mouseup', removeHandler);
          Controller.main.removeEventListener('mouseleave', removeHandler);
        }

        Controller.main.addEventListener('mousemove', mouseMoveHandler);
        Controller.main.addEventListener('mouseup', removeHandler);
        Controller.main.addEventListener('mouseleave', removeHandler);
      };
    }
  }
  
  static disableDrag(frame) {
    const titleNode = Frame.getTitleNode(frame);
    if (titleNode) titleNode.onmousedown = null;
  }
  
  disableDrag() {
    console.log('wow')
  }
  
  static enableResize(frame) {
    const resizeButton = document.createElement('i');
    resizeButton.className = 'fas fa-caret-right frame-resize';
    frame.frameNode.append(resizeButton);
    resizeButton.onmousedown = (e) => {
      e.preventDefault();
      let xPrevious = e.clientX;
      let yPrevious = e.clientY;

      const mouseMoveHandler = (e) => {
        let newWidth = frame.width + e.clientX - xPrevious;
        let newHeight = frame.height + e.clientY - yPrevious;
        
        frame.width = newWidth < 48 ? 48 : newWidth;
        frame.height = newHeight < 48 ? 48 : newHeight;
        
        xPrevious = newWidth < 48 ? xPrevious : e.clientX;
        yPrevious = newHeight < 48 ? yPrevious : e.clientY;
      }

      const removeHandler = () => {
        Controller.main.removeEventListener('mousemove', mouseMoveHandler);
        Controller.main.removeEventListener('mouseup', removeHandler);
        Controller.main.removeEventListener('mouseleave', removeHandler);
      }

      Controller.main.addEventListener('mousemove', mouseMoveHandler);
      Controller.main.addEventListener('mouseup', removeHandler);
      Controller.main.addEventListener('mouseleave', removeHandler);
    };
  }
  
  static disableResize(frame) {
    
  }
  
  static enableClickToFront(frame) {
    frame.frameNode.onmousedown = () => {
      Controller.addFrame(frame);
    }
  }
  
  static disableClickToFront(frame) {
    frame.frameNode.onmousedown = null;
  }

  static createFrame(options) {
    options = options ? options : {};
    const {
      disableTitle,
      disableStatus,
      disableDrag,
      disableClickToFront,
      disableResize,
      disableShadow,
      app
     } = options;
    
    console.log(app);
 
    // build DOM structure - permanent nodes
    const frameNode = document.createElement('div');
    const frameBody = document.createElement('div');
    frameNode.className = 'frame';
    frameBody.className = 'frame-body';
    frameBody.style.height = '%100';
    frameNode.appendChild(frameBody);

    // set up frame object
    const _frame = { frameNode };
    const frame = new Proxy(_frame, {
      set: (...params) => {
        const [target, property, value, receiver] = params;
        const result = Reflect.set(...params);
        switch(property) {
          case 'x':
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
          case 'title':
            const titleBar = Frame.getTitleNode(frame);
            if(titleBar)
              titleBar.innerHTML = `<div class="frame-title-text">${value}</div>`;
            break;
        }
        return result;
      }
    });
    Object.assign(frame, options);
    
    // create title / status first
    if (!disableTitle) Frame.enableTitleNode(frame);
    if (!disableStatus) Frame.enableStatusNode(frame);
    
    // setup actions
    if (!disableDrag) Frame.enableDrag(frame);
    if (!disableClickToFront) Frame.enableClickToFront(frame);
    if (!disableResize) Frame.enableResize(frame);
    
    //attach appp
    if (app) frameBody.append(app);

    return frame;
  }

  static setTitle(frame, title) {
    const titleBar = Frame.getTitleNode(frame);
    if(titleBar) titleBar[0].innerText = title;
  }
}

export default Frame;