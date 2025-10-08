# Design Guidelines: Modern Flipkart-Style Fashion E-Commerce Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading e-commerce platforms (Flipkart, Shopify, ASOS, Myntra) with a modern, futuristic twist for fashion retail. The design prioritizes visual richness, product discovery, and seamless shopping experience.

## Core Design Principles

1. **Visual Hierarchy**: Products are heroes - large imagery, clear pricing, prominent CTAs
2. **Scannability**: Grid-based layouts for rapid product browsing
3. **Trust & Clarity**: Clean information architecture, transparent pricing, clear stock indicators
4. **Responsive First**: Mobile-optimized with desktop enhancements

## Color Palette

### Light Mode
- **Primary Brand**: 40 95% 55% (vibrant blue - trust & energy)
- **Accent**: 280 85% 65% (purple - premium fashion feel)
- **Success/Discount**: 140 75% 45% (green for offers)
- **Background**: 0 0% 98% (soft white)
- **Surface**: 0 0% 100% (pure white cards)
- **Text Primary**: 220 15% 15% (near black)
- **Text Secondary**: 220 10% 45% (medium gray)

### Dark Mode
- **Primary Brand**: 40 90% 60% (slightly lighter blue)
- **Accent**: 280 75% 70% (softer purple)
- **Success/Discount**: 140 65% 50%
- **Background**: 220 20% 8% (deep charcoal)
- **Surface**: 220 15% 12% (elevated dark)
- **Text Primary**: 0 0% 95% (off-white)
- **Text Secondary**: 0 0% 65% (light gray)

## Typography

**Font Stack**: 
- Primary: 'Inter' or 'DM Sans' (clean, modern sans-serif)
- Headings: 'Outfit' or 'Space Grotesk' (distinctive fashion-forward)

**Scale**:
- Hero Headlines: text-5xl md:text-6xl font-bold
- Page Titles: text-3xl md:text-4xl font-semibold
- Section Headers: text-2xl md:text-3xl font-semibold
- Product Names: text-lg font-medium
- Body Text: text-base
- Small Labels: text-sm
- Price/Meta: text-xs uppercase tracking-wide

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Grid System**:
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Product Grids: grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6
- Section Spacing: py-12 md:py-16 lg:py-20

## Component Library

### Navigation
- **Header**: Sticky top nav (h-16 md:h-20) with search bar, cart badge, wishlist icon, profile dropdown
- **Search Bar**: Prominent center placement, autocomplete dropdown, category filter
- **Category Nav**: Horizontal scroll on mobile, full menu on desktop with mega-menu dropdowns
- **Mobile Menu**: Slide-in drawer with category accordion

### Product Components
- **Product Card**: Aspect-ratio-square image, hover zoom effect, discount badge (top-right), wishlist heart (top-left), rating stars, price with strikethrough for discounts, quick-view button on hover
- **Product Grid**: Responsive grid with skeleton loaders
- **Filter Sidebar**: Sticky on desktop, collapsible sections (Category, Brand, Price, Size, Color), checkbox inputs, range slider for price, color swatch selectors
- **Sort Dropdown**: Floating above grid on desktop, bottom sheet on mobile

### Shopping Flow
- **Cart Badge**: Animated count bubble on header icon
- **Cart Page**: Two-column layout (items list + price summary), quantity steppers, remove with undo toast, saved items section below
- **Checkout**: Multi-step indicator, address cards with radio selection, add new address form, order summary sticky sidebar

### Detail Pages
- **Product Detail**: Image carousel with thumbnails (left/bottom), size/color selector chips, stock indicator (green dot + text), breadcrumb navigation, tabbed sections (Description, Reviews, Size Guide)
- **Related Products**: Horizontal scroll carousel at bottom

### Admin Panel
- **Sidebar Navigation**: Fixed left sidebar (w-64) with icon + label, collapsible on mobile
- **Data Tables**: Sortable columns, action dropdown per row, bulk selection, search + filter bar
- **Forms**: Two-column layouts for create/edit, image upload with preview, variant builder for size/color/stock

### Feedback Elements
- **Toast Notifications**: Top-right slide-in (success: green, error: red, info: blue)
- **Loading States**: Skeleton screens for content, spinner for actions
- **Empty States**: Illustrated graphics with friendly messaging

### Interactive Elements
- **Buttons**: 
  - Primary: bg-primary text-white rounded-lg px-6 py-3 font-medium
  - Secondary: border-2 border-primary text-primary rounded-lg px-6 py-3
  - Outline on Images: backdrop-blur-md bg-white/20 border border-white/40 text-white
- **Input Fields**: Rounded borders (rounded-lg), focus ring (ring-2 ring-primary), proper dark mode contrast
- **Badges**: Rounded-full px-3 py-1 text-xs font-semibold

## Page-Specific Layouts

### Homepage
- **Hero Section**: Full-width image banner (h-[60vh] md:h-[70vh]) with overlay gradient, centered headline + CTA, no background blur on text
- **Flash Sales**: Horizontal scroll cards with countdown timer
- **Category Grid**: 3x2 on desktop, 2x3 on mobile, image cards with overlay labels
- **Trending Products**: Product grid with "Trending" badge
- **Brand Carousel**: Horizontal scroll with brand logos

### Category/Listing Pages
- **Layout**: Three-column on desktop (filter sidebar 20%, products 80%), full-width on mobile with filter drawer
- **Toolbar**: Breadcrumb + sort + view toggle (grid/list) + filter button (mobile)
- **Pagination**: Load more button or infinite scroll

### Wishlist & Orders
- **Card Layouts**: Similar to cart items with additional metadata (order date, status badge)
- **Status Indicators**: Color-coded badges (Processing: blue, Shipped: purple, Delivered: green)

## Images

### Hero Images
- **Homepage Hero**: Large lifestyle fashion image showcasing collection, model wearing trending outfit, vibrant setting (h-[60vh] to h-[70vh])
- **Category Banners**: Category-specific imagery (Men's section: men's fashion, Women's: women's fashion), medium height (h-[40vh])

### Product Images
- **Product Cards**: Square aspect ratio (1:1), clean white/neutral background for consistency
- **Product Detail**: Multiple angles, model shots, close-up details, lifestyle context shots
- **Category Tiles**: Lifestyle images with products in use, overlaid text labels

### Decorative
- **Empty States**: Illustrated SVG graphics (empty cart, no orders, no wishlist items)
- **Admin Dashboard**: Optional charts and graph visualizations

## Animations

**Use Sparingly**:
- Product card hover: scale-105 transition-transform duration-200
- Button hover: Subtle shadow lift (hover:shadow-lg)
- Cart badge: Scale pulse on item add
- Image carousel: Fade transition (300ms)
- Mobile menu: Slide-in (300ms ease-out)
- Toast notifications: Slide + fade

**Avoid**: Excessive page transitions, parallax scrolling, auto-playing carousels

## Accessibility

- Maintain WCAG AA contrast ratios in both modes
- Form inputs: Consistent focus indicators in dark mode
- Icon buttons: Always include aria-labels
- Interactive elements: Minimum 44x44px touch targets
- Skip navigation link for keyboard users