import { templates, select } from '../settings.js';
import utils from '../utils.js';


class Home {
  constructor(element){
    const thisHome = this;
    thisHome.dom = {};
    thisHome.render(element);
    thisHome.carousel();
    
  }
  render(element){
    const thisHome = this;

    const generatedHtml = templates.homePage();
    thisHome.dom.wrapper = element;
    const homeElement = utils.createDOMFromHTML(generatedHtml);
    thisHome.dom.wrapper.appendChild(homeElement);
   
  }
  carousel() {
    // eslint-disable-next-line no-undef
    new Flickity(select.containerOf.carousel, {
      prevNextButtons: false,
      autoPlay: true,
      imagesLoaded: true,
      percentPosition: false,
    });

  }
}    

export default Home;