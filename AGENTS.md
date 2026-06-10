# WebSquare5 Development Rules

You are editing WebSquare5 enterprise web framework files (.xml/.wq). 
Always adhere to the following architecture when generating or refactoring code:

- **Logic Scope:** All JavaScript functions must be attached to the global page scope `scwin` object (e.g., `scwin.button_onclick = function() { ... };`).
- **Data Collections:** Do not mutate raw arrays directly. Use `dataListId.setCellData(row, col, value)` or `dataMapId.set("key", value)`.
- **UI Interaction:** Access UI components using their explicit ID strings via framework methods, e.g., `com_input.getValue()` or `com_grid.setGridCellColor()`.
- **Network Actions:** Formulate async requests through data Submissions: `$w.executeSubmission("submission_id");`.
- **Avoid:** Do not inject modern ES modules or standard DOM API selectors (`document.querySelector`) unless explicitly creating custom raw HTML blocks.