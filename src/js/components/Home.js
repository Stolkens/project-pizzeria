import { templates } from '../settings.js';
import utils from '../utils.js';

class Home {
  constructor(element){
    const thisHome = this;
    thisHome.dom = {};
    
    thisHome.render(element);
    thisHome.getData();
  }
  render(element){
    const thisHome = this;

    const generatedHtml = templates.homePage();
    thisHome.dom.wrapper = element;
    const homeElement = utils.createDOMFromHTML(generatedHtml);
    
    thisHome.dom.wrapper.appendChild(homeElement);
     
  }
  getData(){  
      
  }
}
      

export default Home;