"use strict";
(globalThis["webpackChunk_coral_xyz_app_extension"] = globalThis["webpackChunk_coral_xyz_app_extension"] || []).push([[981],{

/***/ 17981:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StakeButton)
/* harmony export */ });
/* harmony import */ var _coral_xyz_recoil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16914);
/* harmony import */ var _coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98091);
/* harmony import */ var _coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39811);
/* harmony import */ var _coral_xyz_staking_src_StakeButtonComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12931);
/* harmony import */ var _react_navigation_native__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(70376);
/* harmony import */ var _refactor_navigation_StakeNavigator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(55011);
/* harmony import */ var _refactor_navigation_WalletsNavigator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(71993);
/* provided dependency */ var React = __webpack_require__(2784);







/**
 * Loaded lazily on the Bitcoin Token Detail Page, hence the default function export
 */ function StakeButton() {
    const { publicKey  } = (0,_coral_xyz_recoil__WEBPACK_IMPORTED_MODULE_0__/* .useActiveWallet */ .rTu)();
    const navigation = (0,_react_navigation_native__WEBPACK_IMPORTED_MODULE_6__/* .useNavigation */ .HJ)();
    const programAccountsQuery = (0,_coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useProgramAccountsQuery */ .Xi)(publicKey);
    const { data , isError , isLoading  } = programAccountsQuery;
    const subtitle = isError ? "Error fetching accounts" : isLoading ? undefined : data && data.length > 0 ? `${data.length} account${data.length > 1 ? "s" : ""}` : "Stake some BTC";
    const total = data && data?.length > 0 ? `${(0,_coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__/* .lamportsToSolAsString */ .bv)(data.reduce((acc, curr)=>acc + curr.lamports, 0), {
        appendTicker: true
    })}` : "";
    const inflationRewards = (0,_coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useInflationRewardsQuery */ .lC)(publicKey);
    const totalInflationRewards = inflationRewards.data?.reduce((acc, [_, curr])=>acc + (curr?.amount ?? 0), 0);
    const totalRewards = totalInflationRewards !== undefined ? totalInflationRewards > 0 ? `+${(0,_coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__/* .lamportsToSolAsString */ .bv)(totalInflationRewards, {
        appendTicker: true
    })}` : "" : undefined;
    return /*#__PURE__*/ React.createElement(_coral_xyz_staking_src_StakeButtonComponent__WEBPACK_IMPORTED_MODULE_3__/* .StakeButtonComponent */ .g, {
        subtitle: subtitle,
        total: total,
        totalRewards: totalRewards,
        onPress: isError ? undefined : ()=>{
            navigation.push(_refactor_navigation_WalletsNavigator__WEBPACK_IMPORTED_MODULE_5__/* .Routes */ .Z.StakeNavigator, {
                screen: _refactor_navigation_StakeNavigator__WEBPACK_IMPORTED_MODULE_4__/* .Routes */ .Z.ListStakesScreen,
                params: undefined
            });
        }
    });
}


/***/ })

}]);