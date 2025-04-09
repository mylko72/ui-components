class UI {
    name = 'ui';
    el;
    wrap;
    window;
    document;
    html;
    body;
    uiId;
    eventId;
    selector;
    focusEl = [];
    popupAll = null;
    popupCloseBtnAll = null;
    popupDepth = 0;
    popupDimmed = null; 

    /**
     * UI 클래스를 상속받은 UI는 super(name, el)을 해줘야 한다.
     * @param name {string} UI 이름을 정의한다.
     * @param el {HTMLElement} UI에 해당하는 요소를 넣는다.
     */
    constructor(name, el, selector){
    	this.name = name;
        this.window = window;
        this.document = document;
        this.html = document.documentElement;
        this.body = document.body;
        this.wrap = null;
        
        this.el = el;
        this.selector = selector;
        
        this.setEventId();
    }
    
    init(){
    }
    
    update(){
    }
    
    render(){
    }
    
    attachEvents(){
    }
    
    detachEvents(){
    }
    
    destroy(){
    }
    
    setEventId(){
    	this.uiId = `${this.name}-${this.getRandomStr()}`;
        this.eventId = `.${this.uiId}`;
    }
    /* 최대 6자리 랜덤 숫자 */
    getRandomStr(){
    	return Math.round(Math.random() * 100000);
    }
    
    /**
     * 옵션은 모두 data-xxx 형태로 넘어오게 되고 해당 값의 유형에 맞게 변환해준다.
     * $('selector').data() 하게되면 해당 data-요소가 모두 들어오게 된다.
     * @returns {object}
     * @param options {} 예: data-no="1" data-type="type1" {no:1, type:'type1'}
     */
    parseOptions(options){
    	let splitString;
        let numberArray = [];
        
        if(typeof options.no == 'string'){
        	splitString = options.no.split(',');
            splitString.map((item) => {
            	numberArray.push(+item);
            });
            options.no = numberArray;
        }
        return options;
    }
}

export default UI;