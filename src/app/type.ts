// types/post.ts
export type Post = {
  id: number
  title: string
  quantity?: number | null
  price?: number | null
  content?: string | null
  img?: string | null
  Sales: number
  categoryId: number
  createdAt: Date
}
// types/category.ts
export type Category = {
  id: number
  name: string
}
// types/user.ts
export type User = {
  id: number
  name?: string | null
  email: string
  password: string
  lineid?: string | null
  address?: string | null
  phone?: number | null
  purchaseamount: number
  image?: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}
// types/cart.ts
export type Cart = {
  id: number
  userId: number
  postId: number
  value: number
}
// types/order.ts
export type Order = {
  id: number
  orderId: string
  userId: number
  createdAt: Date
}
// types/orderItem.ts
export type OrderItem = {
  id: number
  orderId: number
  postId: number
  quantity: number
  totalPrice: number
  createdAt: Date
}