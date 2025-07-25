"use strict";
(globalThis["webpackChunk_coral_xyz_app_extension"] = globalThis["webpackChunk_coral_xyz_app_extension"] || []).push([["src_components_Unlocked_Stake_StakeButton_tsx"],{

/***/ "./src/components/Unlocked/Stake/StakeButton.tsx":
/*!*******************************************************!*\
  !*** ./src/components/Unlocked/Stake/StakeButton.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StakeButton)
/* harmony export */ });
/* harmony import */ var _coral_xyz_recoil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @coral-xyz/recoil */ "../recoil/dist/esm/index.js");
/* harmony import */ var _coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @coral-xyz/staking/src/hooks */ "../staking/src/hooks.ts");
/* harmony import */ var _coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @coral-xyz/staking/src/shared */ "../staking/src/shared.tsx");
/* harmony import */ var _coral_xyz_staking_src_StakeButtonComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @coral-xyz/staking/src/StakeButtonComponent */ "../staking/src/StakeButtonComponent.tsx");
/* harmony import */ var _react_navigation_native__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/core/lib/module/index.js");
/* harmony import */ var _refactor_navigation_StakeNavigator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../refactor/navigation/StakeNavigator */ "./src/refactor/navigation/StakeNavigator.tsx");
/* harmony import */ var _refactor_navigation_WalletsNavigator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../refactor/navigation/WalletsNavigator */ "./src/refactor/navigation/WalletsNavigator.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../node_modules/react-refresh/runtime.js */ "../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();







/**
 * Loaded lazily on the Bitcoin Token Detail Page, hence the default function export
 */ function StakeButton() {
    _s();
    const { publicKey  } = (0,_coral_xyz_recoil__WEBPACK_IMPORTED_MODULE_0__.useActiveWallet)();
    const navigation = (0,_react_navigation_native__WEBPACK_IMPORTED_MODULE_6__.useNavigation)();
    const programAccountsQuery = (0,_coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__.useProgramAccountsQuery)(publicKey);
    const { data , isError , isLoading  } = programAccountsQuery;
    const subtitle = isError ? "Error fetching accounts" : isLoading ? undefined : data && data.length > 0 ? `${data.length} account${data.length > 1 ? "s" : ""}` : "Stake some BTC";
    const total = data && data?.length > 0 ? `${(0,_coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__.lamportsToSolAsString)(data.reduce((acc, curr)=>acc + curr.lamports, 0), {
        appendTicker: true
    })}` : "";
    const inflationRewards = (0,_coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__.useInflationRewardsQuery)(publicKey);
    const totalInflationRewards = inflationRewards.data?.reduce((acc, [_, curr])=>acc + (curr?.amount ?? 0), 0);
    const totalRewards = totalInflationRewards !== undefined ? totalInflationRewards > 0 ? `+${(0,_coral_xyz_staking_src_shared__WEBPACK_IMPORTED_MODULE_2__.lamportsToSolAsString)(totalInflationRewards, {
        appendTicker: true
    })}` : "" : undefined;
    return /*#__PURE__*/ React.createElement(_coral_xyz_staking_src_StakeButtonComponent__WEBPACK_IMPORTED_MODULE_3__.StakeButtonComponent, {
        subtitle: subtitle,
        total: total,
        totalRewards: totalRewards,
        onPress: isError ? undefined : ()=>{
            navigation.push(_refactor_navigation_WalletsNavigator__WEBPACK_IMPORTED_MODULE_5__.Routes.StakeNavigator, {
                screen: _refactor_navigation_StakeNavigator__WEBPACK_IMPORTED_MODULE_4__.Routes.ListStakesScreen,
                params: undefined
            });
        },
        __source: {
            fileName: "/Users/srg/Desktop/work/yona-wallet/packages/app-extension/src/components/Unlocked/Stake/StakeButton.tsx",
            lineNumber: 56,
            columnNumber: 5
        },
        __self: this
    });
}
_s(StakeButton, "Kmz9jq7b1iZi1FkuNG8gNhYp1o0=", false, function() {
    return [
        _coral_xyz_recoil__WEBPACK_IMPORTED_MODULE_0__.useActiveWallet,
        _react_navigation_native__WEBPACK_IMPORTED_MODULE_6__.useNavigation,
        _coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__.useProgramAccountsQuery,
        _coral_xyz_staking_src_hooks__WEBPACK_IMPORTED_MODULE_1__.useInflationRewardsQuery
    ];
});
_c = StakeButton;
var _c;
__webpack_require__.$Refresh$.register(_c, "StakeButton");


const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) {}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

}]);
//# sourceMappingURL=src_components_Unlocked_Stake_StakeButton_tsx.js.map