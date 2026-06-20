import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BookingItem {
  ticketId: string
  eventId: string
  eventTitle: string
  ticketName: string
  price: number
  quantity: number
  maxQuantity: number
}

interface BookingStore {
  items: BookingItem[]
  addItem: (item: BookingItem) => void
  removeItem: (ticketId: string) => void
  updateQuantity: (ticketId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.ticketId === item.ticketId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.ticketId === item.ticketId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.maxQuantity) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (ticketId) => {
        set({ items: get().items.filter((i) => i.ticketId !== ticketId) })
      },
      updateQuantity: (ticketId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.ticketId !== ticketId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.ticketId === ticketId ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i
            ),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'events-booking-cart' }
  )
)
