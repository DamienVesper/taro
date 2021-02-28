let RegionManager = IgeClass.extend({
    classId: `RegionManager`,
    componentId: `regionManager`,

    init: function () {
        let self = this;
        self.isAddNewRegion = false;
        self.entitiesInRegion = {};

        if (ige.isClient) {
            $(`#region-modal-client`).on(`submit`, `#region-form`, (e) => {
                e.preventDefault();
                let defaultKey = $(`#region-modal-key`).val();
                self.submitRegion();
            });

            $(`#region-modal-client`).on(`keypress`, (e) => {
                if (e.charCode === 13) {
                    e.preventDefault();
                    self.submitRegion();
                }
            });

            $(`#region-modal-client`).on(`click`, `#region-delete-btn`, (e) => {
                e.preventDefault();
                let defaultKey = $(`#region-modal-defaultKey`).val(); x;
                let updatedRegion = {
                    deleteKey: defaultKey
                };
                self.updateRegionToDatabase(updatedRegion);
            });
        }
    },

    getRegionById (regionName) {
        return ige.$$(`region`).find((region) => {
            if (region && region._stats && region._stats.id === regionName) {
                return true;
            }
        });
    },
    submitRegion: function () {
        let self = this;
        let updatedRegion = {
            dataType: $(`#region-modal-datatype`).val(),
            key: $(`#region-modal-key`).val(),
            default: {
                x: parseFloat($(`#region-modal-x`).val()),
                y: parseFloat($(`#region-modal-y`).val()),
                width: parseFloat($(`#region-modal-width`).val()),
                height: parseFloat($(`#region-modal-height`).val())
            }
        };
        if ($(`#region-modal-key`).val() != $(`#region-modal-defaultKey`).val()) {
            updatedRegion.deleteKey = $(`#region-modal-defaultKey`).val();
        }
        if (updatedRegion.key.includes(`.`)) {
            swal(`Alert!!!`, `cannot create region having '.' in the key`, `error`);
            return;
        }
        self.updateRegionToDatabase(updatedRegion);
    },

    updateRegionToDatabase: function (updatedRegion) {
        let self = this;
        let isRegionDeleted = false;
        let region = ige.regionManager.getRegionById(updatedRegion.key);
        let deleteRegion = ige.regionManager.getRegionById(updatedRegion.deleteKey);
        let isRegionSameAsDeleted = region === deleteRegion;

        if (deleteRegion && updatedRegion.deleteKey) {
            delete ige.game.data.variables[updatedRegion.deleteKey];
            deleteRegion.deleteRegion();
            isRegionDeleted = true;
        }
        if (updatedRegion.key) {
            if (region && region._stats) {
                for (let i in region._stats) {
                    if (updatedRegion[i]) {
                        if (typeof region._stats[i] === `object`) {
                            for (let j in region._stats[i]) {
                                if (updatedRegion[i][j] != undefined) {
                                    region._stats[i][j] = updatedRegion[i][j];
                                }
                                else {
                                    updatedRegion[i][j] = region._stats[i][j];
                                }
                            }
                        } else {
                            region._stats[i] = updatedRegion[i];
                        }
                    }
                }

                region.updateDimension();
            }
            else {
                let updatedRegionKey = updatedRegion.key;
                let copiedRegion = JSON.parse(JSON.stringify(updatedRegion));
                delete copiedRegion.key;
                ige.game.data.variables[updatedRegionKey] = copiedRegion;
                ige.map.createRegions();
            }
        }
        window.updateReactGameState(JSON.parse(JSON.stringify(updatedRegion)));
        if (isRegionDeleted) {
            let newRegion = JSON.parse(JSON.stringify(updatedRegion));
            let regionKey = newRegion.key;
            delete newRegion.key;
            ige.game.data.variables[regionKey] = newRegion;
            ige.map.createRegions();
        }

        $(`#region-modal-client`).modal(`hide`);
    },
    openRegionModal: function (region, key, isAddNewRegion) {
        if (isAddNewRegion) {
            ige.regionManager.isAddNewRegion = isAddNewRegion;
        }
        if (region && !$(`#region-modal-client`).hasClass(`show`)) {
            $(`#region-modal-datatype`).val(region.dataType);
            $(`#region-modal-x`).val(region.default.x);
            $(`#region-modal-y`).val(region.default.y);
            $(`#region-modal-width`).val(region.default.width);
            $(`#region-modal-height`).val(region.default.height);
            $(`#region-modal-defaultKey`).val(key);
            $(`#region-modal-key`).val(key);
            if (isAddNewRegion) {
                $(`#region-update-btn`).html(`<i class='fa fa-plus'></i> Create</button>`);
                $(`#region-delete-btn`).prop(`disabled`, true);
            } else {
                ige.regionManager.isAddNewRegion = false;
                $(`#region-update-btn`).html(`<i class='fa fa-floppy-o'></i> Save</button>`);
                $(`#region-delete-btn`).prop(`disabled`, false);
                // $('#region-modal-key').prop("disabled", true);
            }
            $(`button`).focus(function () {
                this.blur();
            });
            $(`#region-modal-client`).modal({
                show: true
            });
        }
    }
});

if (typeof (module) !== `undefined` && typeof (module.exports) !== `undefined`) { module.exports = RegionManager; }
