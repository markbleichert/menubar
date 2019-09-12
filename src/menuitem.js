import PopupMenu from './popupmenu';
import { KeyCode } from './utils';

class MenuItem {
    constructor(domNode, menuObj) {
        this.domNode = domNode;
        this.menu = menuObj;
    }

    init() {
        this.domNode.tabIndex = -1;

        this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));

        const nextElement = this.domNode.nextElementSibling;

        if (nextElement && nextElement.tagName === 'UL') {
            this.popupMenu = new PopupMenu(nextElement, this);
            this.popupMenu.init();
        }

    }

    handleKeydown(event) {
        let flag = false, clickEvent;

        switch (event.keyCode) {
            case KeyCode.SPACE:
            case KeyCode.RETURN:
                // Create simulated mouse event to mimic the behavior of ATs
                // and let the event handler handleClick do the housekeeping.
                try {
                    clickEvent = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });
                }
                catch (err) {
                    if (document.createEvent) {
                        // DOM Level 3 for IE 9+
                        clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent('click', true, true);
                    }
                }
                event.currentTarget.dispatchEvent(clickEvent);

                flag = true;
                break;

            case event.shiftKey && KeyCode.TAB:
            case KeyCode.UP:
                this.menu.setFocusToPreviousItem(this);
                flag = true;
                break;

            case KeyCode.TAB:
                if (this.isLastPopup() && this.isLastItem()) {
                    if (this.menu) {
                        this.menu.close(true);
                    }
                    flag = false;
                } else {
                    this.menu.setFocusToNextItem(this);
                    flag = true;
                }
                break;

            case KeyCode.DOWN:
                this.menu.setFocusToNextItem(this);
                flag = true;
                break;

            case KeyCode.ESC:
                this.menu.controller.menu.setFocusToItem(this.menu.controller);
                this.menu.close(true);
                flag = true;
                break;

            case KeyCode.LEFT:
            case KeyCode.RIGHT:
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    isLastPopup() {
        return this.menu.controller.menu.menubarItems.indexOf(this.menu.controller) === this.menu.controller.menu.menubarItems.length -1;
    }

    isLastItem() {
        return this.menu.menuitems.indexOf(this) === this.menu.menuitems.length -1;
    }
}

export default MenuItem;
