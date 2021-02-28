let UiToolBox_ToolCreate = IgeEventingClass.extend({
    classId: `UiToolBox_ToolCreate`,
    editorOptions: {
        hide: true
    },

    init: function () {
        this.menuDefinition = [
            {
                group: []
            }
        ];

        let sortArr = []; let i;

        for (i in igeClassStore) {
            if (igeClassStore.hasOwnProperty(i)) {
                if (!igeClassStore[i].prototype.editorOptions || !igeClassStore[i].prototype.editorOptions.hide) {
                    sortArr.push(i);
                }
            }
        }

        sortArr.sort();

        for (i = 0; i < sortArr.length; i++) {
            this.menuDefinition[0].group.push({
                id: sortArr[i],
                icon: `none`,
                text: sortArr[i],
                action: `ige.editor.createObject('${sortArr[i]}', true);`
            });
        }
    },

    enabled: function (val) {
        if (val) {
            // Display menu
            let self = this;
            let toolboxButton = $(`#toolCreate`);
            let position = toolboxButton.offset();
            let left = position.left + toolboxButton.width();
            let top = position.top;
            let height = $(`body`).height();

            ige.editor.ui.menus.create({
                header: {
                    icon: `log_in`,
                    text: `Create Object`
                },
                groups: self.menuDefinition,
                search: true
            }, (elem) => {
                // Now position the menu
                let menuHeight = elem.height();

                top -= menuHeight / 2;

                if (top + menuHeight > height) {
                    top = height - menuHeight - 10;
                }

                if (top - menuHeight < 30) {
                    top = 30;
                }

                elem.css(`left`, left)
                    .css(`top`, top);
            });
        } else {
            ige.editor.ui.menus.closeAll();
        }
    }
});
