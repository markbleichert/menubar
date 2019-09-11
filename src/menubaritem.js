import PopupMenu from './popupmenu';
import { KeyCode } from './utils';

class MenubarItem {
    constructor(domNode, menuObj) {
        this.menu = menuObj;
        this.domNode = domNode;
        this.popupMenu = false;
        this.hasHover = false;
    }

    init() {
        this.domNode.tabIndex = -1;

        this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

        const nextElement = this.domNode.nextElementSibling;

        if (nextElement && nextElement.tagName === 'DIV') {
            this.popupMenu = new PopupMenu(nextElement, this);
            this.popupMenu.init();
        }

    }

    handleKeydown(event) {
        let flag = false;

        switch (event.keyCode) {
            case KeyCode.SPACE:
            case KeyCode.RETURN:
            case KeyCode.DOWN:
                if (this.popupMenu) {
                    this.popupMenu.open();
                    this.popupMenu.setFocusToFirstItem();
                    flag = true;
                }
                break;

            case event.shiftKey && KeyCode.TAB:
            case KeyCode.LEFT:
                this.menu.setFocusToPreviousItem(this);
                flag = true;
                break;

            case KeyCode.TAB:
            case KeyCode.RIGHT:
                this.menu.setFocusToNextItem(this);
                flag = true;
                break;

            case KeyCode.UP:
                if (this.popupMenu) {
                    this.popupMenu.open();
                    this.popupMenu.setFocusToLastItem();
                    flag = true;
                }
                break;

            case KeyCode.HOME:
            case KeyCode.PAGEUP:
                this.menu.setFocusToFirstItem();
                flag = true;
                break;

            case KeyCode.END:
            case KeyCode.PAGEDOWN:
                this.menu.setFocusToLastItem();
                flag = true;
                break;

            case KeyCode.ESC:
                this.popupMenu.close(true);
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    setExpanded(value) {
        this.domNode.setAttribute('aria-expanded', !!value);
    }

    handleFocus(event) {
        this.menu.hasFocus = true;
        this.menu.setFocusToItem(this);
    }

    handleBlur(event) {
        this.menu.hasFocus = false;
    }

    handleMouseover(event) {
        this.hasHover = true;
        this.menu.setFocusToItem(this);
    }

    handleMouseout(event) {
        this.hasHover = false;

        if (this.popupMenu) {
            setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 10);
        }
    }
}

export default MenubarItem;
