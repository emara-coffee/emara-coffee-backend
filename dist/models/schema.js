"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketMessagesRelations = exports.ticketsRelations = exports.orderItemsRelations = exports.ordersRelations = exports.cartItemsRelations = exports.cartsRelations = exports.reviewCommentsRelations = exports.reviewsRelations = exports.productsRelations = exports.addressesRelations = exports.usersRelations = exports.ticketMessages = exports.tickets = exports.orderItems = exports.orders = exports.cartItems = exports.carts = exports.reviewComments = exports.reviews = exports.products = exports.addresses = exports.users = exports.ticketStatusEnum = exports.refundStatusEnum = exports.orderStatusEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['user', 'admin']);
exports.orderStatusEnum = (0, pg_core_1.pgEnum)('order_status', [
    'placed',
    'packaged',
    'dispatched',
    'delivered',
    'cancelled',
]);
exports.refundStatusEnum = (0, pg_core_1.pgEnum)('refund_status', [
    'none',
    'pending',
    'processed',
]);
exports.ticketStatusEnum = (0, pg_core_1.pgEnum)('ticket_status', ['open', 'closed']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    role: (0, exports.roleEnum)('role').default('user').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.addresses = (0, pg_core_1.pgTable)('addresses', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    street: (0, pg_core_1.text)('street').notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 255 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 255 }).notNull(),
    zipCode: (0, pg_core_1.varchar)('zip_code', { length: 50 }).notNull(),
    country: (0, pg_core_1.varchar)('country', { length: 255 }).notNull(),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 255 }).notNull(),
    price: (0, pg_core_1.numeric)('price', { precision: 10, scale: 2 }).notNull(),
    stock: (0, pg_core_1.integer)('stock').notNull().default(0),
    images: (0, pg_core_1.jsonb)('images').default([]).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.reviews = (0, pg_core_1.pgTable)('reviews', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    productId: (0, pg_core_1.uuid)('product_id').references(() => exports.products.id).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    text: (0, pg_core_1.text)('text'),
    media: (0, pg_core_1.jsonb)('media').default([]).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.reviewComments = (0, pg_core_1.pgTable)('review_comments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    reviewId: (0, pg_core_1.uuid)('review_id').references(() => exports.reviews.id).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    text: (0, pg_core_1.text)('text').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.carts = (0, pg_core_1.pgTable)('carts', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.cartItems = (0, pg_core_1.pgTable)('cart_items', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    cartId: (0, pg_core_1.uuid)('cart_id').references(() => exports.carts.id).notNull(),
    productId: (0, pg_core_1.uuid)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    addressId: (0, pg_core_1.uuid)('address_id').references(() => exports.addresses.id).notNull(),
    totalAmount: (0, pg_core_1.numeric)('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.orderStatusEnum)('status').default('placed').notNull(),
    refundStatus: (0, exports.refundStatusEnum)('refund_status').default('none').notNull(),
    penaltyAmount: (0, pg_core_1.numeric)('penalty_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.orderItems = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    orderId: (0, pg_core_1.uuid)('order_id').references(() => exports.orders.id).notNull(),
    productId: (0, pg_core_1.uuid)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    priceAtTime: (0, pg_core_1.numeric)('price_at_time', { precision: 10, scale: 2 }).notNull(),
});
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }).notNull(),
    status: (0, exports.ticketStatusEnum)('status').default('open').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.ticketMessages = (0, pg_core_1.pgTable)('ticket_messages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    ticketId: (0, pg_core_1.uuid)('ticket_id').references(() => exports.tickets.id).notNull(),
    senderId: (0, pg_core_1.uuid)('sender_id').references(() => exports.users.id).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    addresses: many(exports.addresses),
    reviews: many(exports.reviews),
    reviewComments: many(exports.reviewComments),
    orders: many(exports.orders),
    tickets: many(exports.tickets),
    ticketMessages: many(exports.ticketMessages),
}));
exports.addressesRelations = (0, drizzle_orm_1.relations)(exports.addresses, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.addresses.userId],
        references: [exports.users.id],
    }),
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    reviews: many(exports.reviews),
    cartItems: many(exports.cartItems),
    orderItems: many(exports.orderItems),
}));
exports.reviewsRelations = (0, drizzle_orm_1.relations)(exports.reviews, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.reviews.productId],
        references: [exports.products.id],
    }),
    user: one(exports.users, {
        fields: [exports.reviews.userId],
        references: [exports.users.id],
    }),
    comments: many(exports.reviewComments),
}));
exports.reviewCommentsRelations = (0, drizzle_orm_1.relations)(exports.reviewComments, ({ one }) => ({
    review: one(exports.reviews, {
        fields: [exports.reviewComments.reviewId],
        references: [exports.reviews.id],
    }),
    user: one(exports.users, {
        fields: [exports.reviewComments.userId],
        references: [exports.users.id],
    }),
}));
exports.cartsRelations = (0, drizzle_orm_1.relations)(exports.carts, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.carts.userId],
        references: [exports.users.id],
    }),
    items: many(exports.cartItems),
}));
exports.cartItemsRelations = (0, drizzle_orm_1.relations)(exports.cartItems, ({ one }) => ({
    cart: one(exports.carts, {
        fields: [exports.cartItems.cartId],
        references: [exports.carts.id],
    }),
    product: one(exports.products, {
        fields: [exports.cartItems.productId],
        references: [exports.products.id],
    }),
}));
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.orders.userId],
        references: [exports.users.id],
    }),
    address: one(exports.addresses, {
        fields: [exports.orders.addressId],
        references: [exports.addresses.id],
    }),
    items: many(exports.orderItems),
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderItems.orderId],
        references: [exports.orders.id],
    }),
    product: one(exports.products, {
        fields: [exports.orderItems.productId],
        references: [exports.products.id],
    }),
}));
exports.ticketsRelations = (0, drizzle_orm_1.relations)(exports.tickets, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.tickets.userId],
        references: [exports.users.id],
    }),
    messages: many(exports.ticketMessages),
}));
exports.ticketMessagesRelations = (0, drizzle_orm_1.relations)(exports.ticketMessages, ({ one }) => ({
    ticket: one(exports.tickets, {
        fields: [exports.ticketMessages.ticketId],
        references: [exports.tickets.id],
    }),
    sender: one(exports.users, {
        fields: [exports.ticketMessages.senderId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=schema.js.map