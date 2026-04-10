/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ListRenderer } from "@web/views/list/list_renderer";

patch(ListRenderer.prototype, {
    /**
     * Override to add arrow key navigation when in edit mode.
     * By default, Odoo 18 only handles Tab, Shift+Tab, Enter, Escape in edit mode.
     * This patch adds ArrowUp, ArrowDown, ArrowLeft, ArrowRight support.
     */
    onCellKeydownEditMode(hotkey, cell, group, record) {
        switch (hotkey) {
            case "arrowup":
            case "arrowdown":
                return this._smArrowNavigateVertical(hotkey, cell, group, record);
            case "arrowleft":
            case "arrowright": {
                const result = this._smArrowNavigateHorizontal(hotkey, cell);
                if (result !== null) {
                    return result;
                }
                // null means: let browser handle cursor movement inside the input
                return false;
            }
        }
        return super.onCellKeydownEditMode(hotkey, cell, group, record);
    },

    /**
     * Move to the same column in the row above or below.
     * Saves the current cell, then enters edit mode on the target record.
     */
    _smArrowNavigateVertical(hotkey, cell, group, record) {
        const { list } = this.props;
        const records = list.records;
        const index = records.indexOf(record);

        let futureRecord;
        if (hotkey === "arrowup" && index > 0) {
            futureRecord = records[index - 1];
        } else if (hotkey === "arrowdown" && index < records.length - 1) {
            futureRecord = records[index + 1];
        }

        if (!futureRecord) {
            return false;
        }

        const column = this.columns.find((c) => c.name === cell.getAttribute("name"));

        list.leaveEditMode({ validate: true }).then((canProceed) => {
            if (canProceed) {
                this.cellToFocus = { column, record: futureRecord };
                list.enterEditMode(futureRecord);
            }
        });

        return true;
    },

    /**
     * Move to the adjacent editable cell on the same row (left or right).
     *
     * Smart behavior:
     *  - If the active element is a text input/textarea and the cursor is NOT
     *    at the boundary, return null so the browser moves the cursor normally.
     *  - If the cursor IS at the boundary (position 0 for left, end for right),
     *    or if there is no text selection to worry about, jump to the next cell.
     *  - If there is a text selection (e.g. all text highlighted), let the
     *    browser collapse the selection first (return null).
     *
     * @returns {boolean|null} true = handled, false = not handled, null = let browser handle
     */
    _smArrowNavigateHorizontal(hotkey, cell) {
        const activeEl = document.activeElement;
        if (!activeEl) {
            return null;
        }

        // Don't interfere with select dropdowns — arrow keys change the option
        if (activeEl.tagName === "SELECT") {
            return null;
        }

        // For text-like inputs, check cursor position
        if (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") {
            try {
                // If there is a text selection, let the browser collapse it first
                if (activeEl.selectionStart !== activeEl.selectionEnd) {
                    return null;
                }

                const cursorPos = activeEl.selectionStart;
                const textLen = activeEl.value.length;

                // Cursor not at boundary → let browser move cursor within text
                if (hotkey === "arrowleft" && cursorPos > 0) {
                    return null;
                }
                if (hotkey === "arrowright" && cursorPos < textLen) {
                    return null;
                }
            } catch {
                // selectionStart not supported (number, date, etc.) — don't navigate
                return null;
            }
        }

        // At boundary (or non-text element) → navigate to adjacent cell
        const row = cell.parentElement;
        let toFocus;

        if (hotkey === "arrowleft") {
            toFocus = this.findPreviousFocusableOnRow(row, cell);
        } else {
            toFocus = this.findNextFocusableOnRow(row, cell);
        }

        if (toFocus) {
            this.focus(toFocus);
            return true;
        }

        return false;
    },
});
