import MenuBarItem from './menubaritem';

class Menubar {
    constructor(domNode) {
        this.domNode = domNode;
        this.menubarItems = [];
        this.firstItem = null;
        this.lastItem = null;
        this.hasHover = false;
    }

    init() {
        let elem = this.domNode.firstElementChild;

        while (elem) {
            let menuElement = elem.firstElementChild;

            if (elem && menuElement && menuElement.tagName === 'A') {
                const menubarItem = new MenuBarItem(menuElement, this);
                menubarItem.init();

                this.menubarItems.push(menubarItem);
            }

            elem = elem.nextElementSibling;
        }

        const numItems = this.menubarItems.length;
        if (numItems > 0) {
            this.firstItem = this.menubarItems[ 0 ];
            this.lastItem = this.menubarItems[ numItems - 1 ];
        }

        this.firstItem.domNode.tabIndex = 0;
    }

    setFocusToItem(newItem) {
        let isExpanded = false;

        for (var i = 0; i < this.menubarItems.length; i++) {
            var mbi = this.menubarItems[i];

            if (mbi.domNode.tabIndex == 0) {
                isExpanded = mbi.domNode.getAttribute('aria-expanded') === 'true';
            }

            mbi.domNode.tabIndex = -1;

            if (isExpanded && mbi.popupMenu) {
                mbi.popupMenu.close(true);
            }
        }

        newItem.domNode.tabIndex = 0;

        // set focus only when using keys
        if (!newItem.hasHover) {
            newItem.domNode.focus();
        }

        if (newItem.popupMenu) {
            newItem.popupMenu.open();
        }
    }

    setFocusToFirstItem(flag) {
        this.setFocusToItem(this.firstItem);
    }

    setFocusToLastItem(flag) {
        this.setFocusToItem(this.lastItem);
    }

    setFocusToPreviousItem(currentItem) {
        let newItem;

        if (currentItem === this.firstItem) {
            newItem = this.lastItem;
        } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[ index - 1 ];
        }

        this.setFocusToItem(newItem);
    }

    setFocusToNextItem(currentItem) {
        let newItem;

        if (currentItem === this.lastItem) {
            newItem = this.firstItem;
        } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[ index + 1 ];
        }

        this.setFocusToItem(newItem);

    }
}

export default Menubar;
