// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// TODO: Unnecessary when eslint-plugin-prettier is upgraded
/* eslint-disable prettier/prettier */

// Root Reducer, used to register, and remove core reducers of each instance
export {default} from './root';
export {default as keplerGlReducer} from './root';

// Core Reducer
export {
  default as keplerGlReducerCore,
  visStateLens,
  mapStateLens,
  uiStateLens,
  mapStyleLens
} from './core';

// Each individual reducer
export {default as visStateReducer} from './vis-state';
export {default as mapStateReducer} from './map-state';
export {default as uiStateReducer} from './ui-state';
export {default as mapStyleReducer} from './map-style';
export {default as providerReducer} from './provider-state';

// reducer updaters

export * as visStateUpdaters from './vis-state-updaters';
export * as mapStateUpdaters from './map-state-updaters';
export * as mapStyleUpdaters from './map-style-updaters';
export * as uiStateUpdaters from './ui-state-updaters';

// This will be deprecated
export * as combineUpdaters from './combined-updaters';
export * as combinedUpdaters from './combined-updaters';
export type {KeplerGlState} from './combined-updaters';
export {addDataToMapUpdater, replaceDataInMapUpdater} from './combined-updaters';

// reducer merges
export * as visStateMergers from './vis-state-merger';
export * from './vis-state-selectors';
export * from './vis-state-merger';
export * from './provider-state-updaters';
export * from './provider-state';
export * from './ui-state';
export * from './map-state';
export {getInitialInputStyle, loadMapStylesUpdater, INITIAL_MAP_STYLE} from './map-style-updaters';
export {fitBoundsUpdater, pickViewportPropsFromMapState, INITIAL_MAP_STATE} from './map-state-updaters';

// Helpers
export * from './composer-helpers';

// export types
export * from './vis-state-updaters';

export {INITIAL_UI_STATE} from './ui-state-updaters';

export type {
  MapboxStyleUrl,
  MapStyle
} from './map-style-updaters';

export * from './data-utils';
export * from './export-utils';
export * from './interaction-utils';
export * from './layer-utils';
export * as providerStateUpdaters from './provider-state-updaters';

export {enhanceReduxMiddleware} from './middleware';
