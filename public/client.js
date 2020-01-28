import Utilities from './utilities.js'
import Frame from './components/Frame/Frame.js'
import Controller from './controller.js'
import TestApp from './testapp.js'
import Terminal from './components/Terminal/Terminal.js'
import BlockController from './components/BlockGrid/BlockController.js'


const main = document.getElementById('main');
Controller.setMain(main);
window.test = new Frame({title: 'Block Grid Options', x: 5, y: 5, height: 200, width: 200, app: BlockController });
// window.test1 = new Frame({title: 'test1', x: 20, y: 200, height: 200, width: 200 });
// window.test2 = new Frame({title: 'test2', x: 20, y: 200, height: 200, width: 200 });
Controller.addFrame(window.test);
// Controller.addFrame(window.test1);
// Controller.addFrame(window.test2);

// Controller.setMain(main);
// window.temp = Frame.createFrame({ x: 20, y: 200, height: 200, width: 200, disableStatus: true, disableClickToFront: true, app: new TestApp() });
// const temp2 = Frame.createFrame({ x: 20, y: 200, height: 200, width: 200 });
// const temp3 = Frame.createFrame({ x: 20, y: 200, height: 200, width: 200 });
// console.log(window.temp);
// console.log(Controller.main)
// window.temp.title = 'hello there it';
// Controller.addFrame(window.temp);
// Controller.addFrame(temp2);
// Controller.addFrame(temp3);
