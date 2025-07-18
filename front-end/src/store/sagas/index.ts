import { cartSaga } from "./cartSaga"
import { registrationSaga } from "./registrationSaga"
import { wishlistSaga } from "./wishlistSaga"
import { compareSaga } from "./compareSaga"
import { productSaga } from "./productSaga"
import { orderSaga } from "./orderSaga"

// Root saga that combines all sagas
export default function* rootSaga() {
   yield* cartSaga()
   yield* registrationSaga()
   yield* wishlistSaga()
   yield* compareSaga()
   yield* productSaga()
   yield* orderSaga()
}
