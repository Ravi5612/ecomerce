import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  const subtotal = getCartAmount()
  const shipping = subtotal === 0 ? 0 : delivery_fee
  const total = subtotal + shipping

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title text1="Cart" text2="Totals" />
      </div>
      <div className="flex flex-col gap-4 text-base">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Tax</span>
          <span className="font-semibold">{currency}0.00</span>
        </div>
        <hr />
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Shipping</span>
          <span className="font-semibold">{currency}{shipping.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between items-center py-2 font-bold text-lg">
          <span>Total</span>
          <span>{currency}{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default CartTotal