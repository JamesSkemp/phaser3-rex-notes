import GetExpandedChildWidth from './GetExpandedChildWidth.js';
import GetExpandedChildHeight from './GetExpandedChildHeight.js';
import ResizeGameObject from '../../../plugins/utils/size/ResizeGameObject.js';
import GlobZone from '../../../plugins/utils/align/GlobZone.js';

const AlignIn = Phaser.Display.Align.In.QuickSet;

var Layout = function (parent, newWidth, newHeight) {
    // Skip invisible sizer
    if (this.rexSizer.hidden) {
        return this;
    }

    this.layoutInit(parent);

    // Set size
    if (newWidth === undefined) {
        newWidth = Math.max(this.childrenWidth, this.minWidth);
    }
    if (newHeight === undefined) {
        newHeight = Math.max(this.childrenHeight, this.minHeight);
    }
    this.resize(newWidth, newHeight);

    var remainder;
    if (this.orientation === 0) {
        remainder = this.width - this.childrenWidth;
    } else {
        remainder = this.height - this.childrenHeight;
    }
    var proportionLength;
    if ((remainder > 0) && (this.childrenProportion > 0)) {
        if (this.orientation === 0) {
            remainder = this.width - this.getChildrenWidth(false);
        } else {
            remainder = this.height - this.getChildrenHeight(false);
        }
        proportionLength = remainder / this.childrenProportion;
    } else {
        proportionLength = 0;
    }
    this.proportionLength = proportionLength;

    // Layout children    
    var children = this.sizerChildren;
    var child, childConfig, padding;
    var startX = this.left,
        startY = this.top;
    var itemX = startX,
        itemY = startY;
    var x, y, width, height; // Align zone
    var newChildWidth, newChildHeight;
    for (var i = 0, cnt = children.length; i < cnt; i++) {
        child = children[i];
        if (child.rexSizer.hidden) {
            continue;
        }

        childConfig = child.rexSizer;
        padding = childConfig.padding;

        // Set size
        newChildWidth = GetExpandedChildWidth(this, child);
        newChildHeight = GetExpandedChildHeight(this, child);
        if (child.isRexSizer) {
            child.layout(this, newChildWidth, newChildHeight);
        } else {
            ResizeGameObject(child, newChildWidth, newChildHeight);
        }

        // Set position
        if (this.orientation === 0) { // x
            if ((childConfig.proportion === 0) || (proportionLength === 0)) {
                width = child.width;
            } else {
                width = (childConfig.proportion * proportionLength);
            }
            x = (itemX + padding.left);
            itemX += (width + padding.left + padding.right);
            y = (itemY + padding.top);
            height = (this.height - padding.top - padding.bottom);
        } else { // y
            if ((childConfig.proportion === 0) || (proportionLength === 0)) {
                height = child.height;
            } else {
                height = (childConfig.proportion * proportionLength);
            }
            y = (itemY + padding.top);
            itemY += (height + padding.top + padding.bottom);
            x = (itemX + padding.left);
            width = (this.width - padding.left - padding.right);
        }

        GlobZone.setPosition(x, y).setSize(width, height);
        AlignIn(child, GlobZone, childConfig.align);
        this.resetChildState(child);
    }

    // Layout background children
    this.layoutBackgrounds();

    return this;
}

export default Layout;