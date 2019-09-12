import MenuItem from './menuitem';

class PopupMenu {
    constructor(domNode, controllerObj) {
        this.domNode    = domNode;
        this.controller = controllerObj;
        this.menuitems = [];
        this.firstItem = null;
        this.lastItem = null;
        this.hasHover = false;
    }

    init() {
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

        const nodeList = this.domNode.querySelectorAll('.nav-group__link');

        for (var i = 0; i < nodeList.length; i++) {
            const el = nodeList[i];

            if (el && el.tagName === 'A') {
                const menuItem = new MenuItem(el, this);
                menuItem.init();
                this.menuitems.push(menuItem);
            }
        };

        const numItems = this.menuitems.length;
        if (numItems > 0) {
            this.firstItem = this.menuitems[0];
            this.lastItem = this.menuitems[ numItems - 1 ];
        }
    }

    handleMouseover(event) {
        this.hasHover = true;
    }

    handleMouseout(event) {
        this.hasHover = false;
        setTimeout(this.close.bind(this, false), 10);
    }

    setFocusToFirstItem() {
        this.firstItem.domNode.focus();
    }

    setFocusToLastItem() {
        this.lastItem.domNode.focus();
    }

    setFocusToPreviousItem(currentItem) {
        if (currentItem === this.firstItem) {
            this.controller.menu.setFocusToItem(this.controller);
        } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[ index - 1 ].domNode.focus();
        }
    }

    setFocusToNextItem(currentItem) {
        if (currentItem === this.lastItem) {
            this.controller.menu.setFocusToNextItem(this.controller);
        } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[ index + 1 ].domNode.focus();
        }
    }

    isNotMouseOver() {
        return !this.hasHover && !this.controller.hasHover
    }

    open() {
        // Get position and bounding rectangle of controller object's DOM node
        var rect = this.controller.domNode.getBoundingClientRect();

        this.domNode.style.display = 'block';
        this.domNode.style.position = 'absolute';
        // this.domNode.style.top = (rect.height + 38) + 'px';
        this.domNode.style.zIndex = 100;

        this.controller.setExpanded(true);
    }

    close(force = false) {
        if (force || this.isNotMouseOver()) {
            this.domNode.style.display = 'none';
            this.domNode.style.zIndex = 0;

            this.controller.setExpanded(false);
        }
    }
}

export default PopupMenu;
