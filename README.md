# Literary Haven

Build a production-ready, premium full-stack online bookstore using Next.js (latest stable version) with TypeScript.

The website must look and feel like a high-end modern international bookstore, with a visually impressive, smooth, responsive, animated UI and a complete working backend.

1. Technology Stack

Use:

Next.js with App Router

TypeScript

Tailwind CSS

Framer Motion / Motion for animations

shadcn/ui for polished components

MongoDB as the primary database

Mongoose for MongoDB models

NextAuth.js / Auth.js for authentication

Next.js API Routes / Server Actions for backend functionality

Cloudinary or another proper image-storage solution for book images

Stripe or a suitable payment integration architecture

Zod for validation

React Hook Form for forms

Lucide React icons

The project must be properly structured and scalable.

2. Premium UI / UX

Create a very high-quality bookstore interface, not a basic template.

Design requirements:

Premium modern typography

Beautiful hero section

Smooth page transitions

Framer Motion animations

Scroll reveal animations

Hover animations

Animated book cards

3D-style book hover effects

Smooth image transitions

Animated buttons

Animated cart drawer

Wishlist animations

Loading skeletons

Toast notifications

Responsive mobile navigation

Beautiful desktop mega menu

Dark/light mode

Elegant shadows and glass effects where appropriate

Excellent spacing and visual hierarchy

Fully responsive on mobile, tablet and desktop

Accessibility-friendly UI

SEO-friendly structure

The design should feel like a combination of a premium publishing platform + modern e-commerce store.

Do not create a generic dashboard or plain CRUD interface.

3. Homepage

Create an impressive homepage containing:

Hero Section

Large premium bookstore hero

Animated headline

Short description

"Explore Books" CTA

"Shop Now" CTA

Animated floating book covers

Subtle background animation

Premium visual composition

Categories

Create categories such as:

Fiction

Horror

Mystery

Thriller

Romance

Fantasy

Science Fiction

Biography

History

Self Help

Business

Technology

Computer Science

AI & Machine Learning

Data Science

Programming

Psychology

Philosophy

Islamic Books

Children's Books

Academic Books

Literature

Featured Books

Animated horizontal/vertical book showcase.

Best Sellers

Display best-selling books.

New Arrivals

Display recently added books.

Horror Collection

Create a dedicated premium horror collection section.

Recommended Books

Use recommendation logic based on:

Category

Genre

User interests

Previously viewed books

Previously purchased books

4. 1000+ Books

The application must support 1000+ books.

Do not hardcode only a few books.

Create a proper MongoDB book database containing at least 1000 realistic book records, preferably distributed across multiple categories and genres.

Each book should have:

_id
title
slug
author
description
shortDescription
isbn
publisher
publicationDate
language
pages
category
genre
tags
rating
reviewCount
price
discountPrice
stock
coverImage
galleryImages
previewUrl
pdfUrl
physicalAvailable
digitalAvailable
featured
bestSeller
newArrival
createdAt
updatedAt


Use realistic book information and avoid duplicate records.

5. Book Images

Every book must have an appropriate high-quality cover image.

Do NOT use one generic image for every book.

Create a scalable image system where each book can have:

Cover image

Multiple gallery images

Author image if available

Preview image

The BookCard should look premium.

Book cards should include:

High-quality cover

Title

Author

Rating

Price

Discount

Availability

Wishlist button

Quick View

Add to Cart button

Add beautiful hover effects.

6. Book Details Page

Create a complete /books/[slug] page.

Show:

Large book cover

Image gallery

Title

Author

Rating

Reviews

Description

ISBN

Publisher

Publication date

Number of pages

Language

Genre

Tags

Price

Discount price

Stock

Format selection

Format options:

Physical Book

Customer receives the printed/hard copy through delivery.

Digital Book

Customer receives downloadable/readable digital version.

Both

Customer can purchase both formats where available.

Provide:

Add to Cart

Buy Now

Add to Wishlist

Quantity selector

Format selector

Share button

Book preview

Related books

Recommended books

7. Search System

Create a powerful bookstore search.

Search by:

Title

Author

ISBN

Category

Genre

Tags

Add:

Search suggestions

Debounced search

Search results page

Filters

Sorting

Pagination

Price range

Category filter

Genre filter

Rating filter

Availability filter

Physical/Digital filter

Support searching through 1000+ books efficiently.

Use MongoDB indexes where appropriate.

8. Authentication

Create complete authentication connected to MongoDB.

Features:

Registration

Login

Logout

Forgot password

Reset password

Protected routes

Session management

Password hashing

Email verification architecture

User profile

Address management

Order history

Wishlist

Saved books

User model:

User
- name
- email
- passwordHash
- phone
- avatar
- role
- addresses
- wishlist
- createdAt
- updatedAt


Roles:

CUSTOMER

ADMIN

Never store plain-text passwords.

9. Cart System

Create a complete shopping cart.

Features:

Add to cart

Remove from cart

Increase quantity

Decrease quantity

Clear cart

Cart drawer

Cart page

Format selection

Automatic subtotal

Discount calculation

Shipping calculation

Final total

Cart should persist for logged-in users.

10. Checkout

Create a premium multi-step checkout.

Steps:

Step 1

Customer information

Step 2

Shipping address

Step 3

Book format

Step 4

Shipping method

Step 5

Payment method

Step 6

Order review

Step 7

Order confirmation

Support:

Physical delivery

Digital delivery

Physical + digital order

11. Payment

Create a proper payment architecture.

Support:

Cash on Delivery

Online payment

Structure the payment system so Stripe or another payment provider can be integrated securely.

Never expose secret API keys to the client.

Payment status:

PENDING
PAID
FAILED
REFUNDED


12. Order Management

Create complete order functionality.

MongoDB Order model:

Order
- orderNumber
- userId
- items
- subtotal
- discount
- shippingFee
- total
- paymentMethod
- paymentStatus
- orderStatus
- shippingAddress
- trackingNumber
- estimatedDelivery
- createdAt
- updatedAt


Order status:

PENDING
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURNED


Customers should be able to track their orders.

13. Delivery Tracking

Create an order tracking page.

Example:

Order Confirmed
      ↓
Processing
      ↓
Packed
      ↓
Shipped
      ↓
Out for Delivery
      ↓
Delivered


Show:

Order number

Book items

Delivery address

Tracking number

Current status

Estimated delivery

Timeline

Order date

Create a beautiful animated tracking timeline.

14. Digital Books

For books available digitally:

After successful payment:

Generate secure access

Show digital book in customer dashboard

Provide secure download/read button

Display purchased digital books

Prevent unauthorized access

Digital files must NOT be publicly exposed.

Use protected server-side access.

15. Physical Books

For physical books:

Stock management

Shipping address

Shipping fee

Delivery status

Tracking number

Estimated delivery

Order confirmation

Admin should be able to update delivery status.

16. Wishlist

Create a complete wishlist.

Features:

Add/remove wishlist

Wishlist page

Wishlist count

Add wishlist item to cart

Animated heart button

Wishlist should be stored in MongoDB for authenticated users.

17. Reviews & Ratings

Allow customers to review books they purchased.

Features:

1–5 star rating

Written review

Review date

Verified purchase badge

Average rating

Review count

Prevent users from repeatedly reviewing the same purchased book unless editing their existing review.

18. Admin Dashboard

Create a premium admin dashboard.

Admin features:

Dashboard

Show:

Total sales

Total orders

Total customers

Total books

Pending orders

Delivered orders

Low-stock books

Digital sales

Physical sales

Recent orders

Book Management

Admin can:

Add book

Edit book

Delete book

Upload cover

Upload gallery

Add digital file

Set physical availability

Set digital availability

Update stock

Set price

Set discount

Set category

Set featured status

Set bestseller status

Order Management

Admin can:

View orders

Search orders

Filter orders

Update status

Add tracking number

Update estimated delivery

View customer information

Manage cancellations/returns

User Management

Admin can:

View users

Search users

Change role

View customer orders

19. Database Architecture

Use MongoDB properly.

Create models for:

User
Book
Category
Cart
Order
Review
Wishlist
Address
Payment


Create proper relationships/references.

Add MongoDB indexes for:

title

author

ISBN

category

genre

slug

price

rating

Use pagination instead of loading all 1000+ books at once.

20. API Architecture

Create clean API endpoints such as:

/api/auth
/api/books
/api/books/[id]
/api/categories
/api/cart
/api/wishlist
/api/orders
/api/orders/[id]
/api/reviews
/api/users
/api/admin/books
/api/admin/orders
/api/admin/users


Validate all incoming data.

Handle errors properly.

Return consistent API responses.

21. Security

Implement:

Password hashing

Authentication middleware

Role-based authorization

Protected admin routes

Server-side validation

Zod validation

Secure cookies/session handling

Rate limiting architecture

MongoDB injection protection

XSS-safe rendering

CSRF-safe architecture where applicable

Secure digital file access

Environment variables for secrets

Never expose:

MONGODB_URI
AUTH_SECRET
PAYMENT_SECRET
CLOUDINARY_SECRET


to the browser.

22. SEO

Every book should have dynamic SEO metadata.

Implement:

Dynamic title

Meta description

Open Graph

Twitter cards

Canonical URLs

Sitemap

Robots.txt

Structured data / Book schema where appropriate

Book URLs should look like:

/books/book-name


23. Performance

The website must remain fast even with 1000+ books.

Use:

Server Components where appropriate

Pagination

Lazy loading

Image optimization

Next.js Image

Database indexes

Caching where appropriate

Efficient MongoDB queries

Skeleton loading

Code splitting

Do not load 1000+ book images on the homepage.

24. Pages

Create at minimum:

/
 /books
 /books/[slug]
 /categories
 /categories/[slug]
 /search
 /cart
 /checkout
 /wishlist
 /orders
 /orders/[id]
 /digital-library
 /login
 /register
 /forgot-password
 /reset-password
 /profile
 /admin
 /admin/books
 /admin/books/new
 /admin/orders
 /admin/users
 /admin/reviews
 /about
 /contact
 /privacy
 /terms


25. Navigation

Desktop navbar:

Logo
Books
Categories
New Arrivals
Best Sellers
Horror
Search
Wishlist
Account
Cart


Mobile navbar:

Hamburger menu

Search

Wishlist

Cart

Account

Make the navigation animated and responsive.

26. BookCard Design

The BookCard is extremely important.

Create a premium animated book card.

On hover:

Slight 3D rotation

Cover zoom

Shadow transition

Quick action buttons appear

Wishlist animation

Add-to-cart animation

Display:

Book Cover
Genre
Title
Author
Rating
Old Price
Current Price
Discount
Availability


Do not make cards look like ordinary Bootstrap cards.

27. Horror Book Collection

Create a special visually distinctive Horror collection.

Include genres such as:

Psychological Horror

Gothic Horror

Supernatural Horror

Paranormal

Dark Fantasy

Thriller

Mystery

Create a dedicated:

/horror


page with premium dark atmospheric design.

28. Seed Database

Create a proper database seeding script.

Example:

npm run seed


It should populate MongoDB with:

1000+ books

Categories

Genres

Sample users

Sample admin

Sample reviews

Sample orders

Do not generate fake duplicate titles.

Use realistic metadata.

For book covers, use legally usable/public-domain or properly licensed image sources. Store image URLs in MongoDB.

29. Environment Variables

Create:

MONGODB_URI=
AUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=


Create .env.example.

Never commit .env.

30. Error Handling

Create polished error states:

404 page

Book not found

Empty cart

Empty wishlist

Empty order history

Payment failure

Authentication error

Network error

Database error

Use friendly messages and beautiful UI.

31. Loading States

Every major page should have:

Skeleton loaders

Button loading states

Image loading states

Page transitions

Checkout loading state

Order processing state

32. Code Quality

Follow:

Clean architecture

Reusable components

TypeScript types

Proper folder structure

No unnecessary duplicate code

No hardcoded secrets

No fake frontend-only authentication

No localStorage-only database replacement

MongoDB must be the actual source of persistent application data

Use reusable components such as:

BookCard
BookGrid
BookCover
Navbar
Footer
SearchBar
CartDrawer
CartItem
WishlistButton
RatingStars
CheckoutForm
OrderTimeline
Pagination
Modal
Toast


33. Important Requirement

This must be a fully functional full-stack application, not merely a frontend mockup.

The complete flow must work:

Register
   ↓
Login
   ↓
Browse 1000+ books
   ↓
Search / Filter
   ↓
Open Book
   ↓
Choose Physical / Digital / Both
   ↓
Add to Cart
   ↓
Checkout
   ↓
Enter Delivery Address
   ↓
Choose Payment
   ↓
Place Order
   ↓
Order Stored in MongoDB
   ↓
Admin Receives Order
   ↓
Admin Updates Order
   ↓
Packed
   ↓
Shipped
   ↓
Out for Delivery
   ↓
Delivered


For digital books:

Purchase
   ↓
Payment Successful
   ↓
Digital Library
   ↓
Secure Book Access


34. Final Development Requirement

Build this project step-by-step and ensure every feature is actually connected.

Do not leave placeholder buttons.

Do not create fake API responses.

Do not use localStorage as the primary database.

Do not create only static pages.

Every important action must communicate with the backend and MongoDB.

Before finishing:

Test registration

Test login

Test logout

Test book search

Test filtering

Test book details

Test wishlist

Test cart

Test checkout

Test order creation

Test MongoDB order storage

Test admin order management

Test delivery status updates

Test digital library

Test physical book workflow

Test responsive design

Test all protected routes

Fix TypeScript errors

Fix build errors

Run production build successfully

The final result should look like a premium commercial bookstore platform, with a sophisticated animated frontend and a real MongoDB-powered backend.

Prioritize quality, performance, security, scalability, beautiful UI, smooth animations, and complete end-to-end functionality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c071748b-6f4e-4b6d-99aa-2510c6c3335c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
