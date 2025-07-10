import { createStore, applyMiddleware, combineReducers } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage" // localStorage
import createSagaMiddleware from "redux-saga"

// Import reducers
import cartReducer from "./reducers/cartReducer"
import registrationReducer from "./reducers/registrationReducer"
import wishlistReducer from "./reducers/wishlistReducer"
import compareReducer from "./reducers/compareReducer"
import stepReducer from "./reducers/stepReducer"
import filterReducer from "./reducers/filterReducer"
import themeReducer from "./reducers/themeReducer"
import productReducer from "./reducers/productReducer"
import orderReducer from "./reducers/orderReducer"

// Import root saga
import rootSaga from "./sagas"

// Create saga middleware
const sagaMiddleware = createSagaMiddleware()

// Configure persist for each reducer separately
const persistConfigCart = { key: "cart", storage }
const persistConfigRegistration = { key: "registration", storage }
const persistConfigWishlist = { key: "wishlist", storage }
const persistConfigCompare = { key: "compare", storage }
const persistConfigStep = { key: "step", storage }
const persistConfigFilter = { key: "filter", storage }
const persistConfigTheme = { key: "theme", storage }
const persistConfigProduct = { key: "product", storage }
const persistConfigOrder = { key: "order", storage }

// Wrap each reducer with persistReducer
const persistedCartReducer = persistReducer(persistConfigCart, cartReducer)
const persistedRegistrationReducer = persistReducer(
   persistConfigRegistration,
   registrationReducer
)
const persistedWishlistReducer = persistReducer(persistConfigWishlist, wishlistReducer)
const persistedCompareReducer = persistReducer(persistConfigCompare, compareReducer)
const persistedStepReducer = persistReducer(persistConfigStep, stepReducer)
const persistedFilterReducer = persistReducer(persistConfigFilter, filterReducer)
const persistedThemeReducer = persistReducer(persistConfigTheme, themeReducer)
const persistedProductReducer = persistReducer(persistConfigProduct, productReducer)
const persistedOrderReducer = persistReducer(persistConfigOrder, orderReducer)

// Combine reducers
const rootReducer = combineReducers({
   cart: persistedCartReducer,
   registration: persistedRegistrationReducer,
   wishlist: persistedWishlistReducer,
   compare: persistedCompareReducer,
   step: persistedStepReducer,
   filter: persistedFilterReducer,
   theme: persistedThemeReducer,
   product: persistedProductReducer,
   order: persistedOrderReducer,
})

// Configure store with saga middleware
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

// Run saga
sagaMiddleware.run(rootSaga)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Persistor
export const persistor = persistStore(store)
