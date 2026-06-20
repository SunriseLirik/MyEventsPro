export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  avatar: string | null
  role: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string | null
  description: string | null
}

export interface EventImage {
  id: string
  url: string
  altText: string
  isMain: boolean
}

export interface Ticket {
  id: string
  name: string
  description: string | null
  price: number
  quantityTotal: number
  quantitySold: number
  isActive: boolean
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  startDate: string
  endDate: string
  locationType: string
  venueName: string | null
  address: string | null
  city: string | null
  isOnline: boolean
  onlineUrl: string | null
  isFree: boolean
  status: string
  isFeatured: boolean
  rating: number
  reviewsCount: number
  viewsCount: number
  attendeesCount: number
  maxAttendees: number | null
  ageRestriction: string | null
  category: Category
  organizer: {
    id: string
    name: string
    avatar: string | null
  }
  images: EventImage[]
  tickets: Ticket[]
}

export interface BookingItem {
  id: string
  ticketId: string
  quantity: number
  price: number
  ticket: Ticket
}

export interface Booking {
  id: string
  eventId: string
  totalAmount: number
  discount: number
  finalAmount: number
  status: string
  paymentStatus: string
  qrCode: string | null
  bookingCode: string
  createdAt: string
  event: Event
  items: BookingItem[]
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string
    avatar: string | null
  }
}
