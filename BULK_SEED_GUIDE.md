# Bulk Category Seeding Guide

This guide explains how to quickly populate your blog with the 6 default categories.

## Option 1: Using the Admin Setup Page (Recommended)

1. Navigate to `/admin/setup` in your browser
2. Click "Seed Categories" button
3. The page will automatically create all 6 default categories
4. You'll be redirected to the Categories page once complete

This is the easiest method and requires no additional setup.

---

## Option 2: Using Browser Console

If you prefer using the browser console:

1. Go to any admin page (e.g., `/admin`)
2. Open your browser's Developer Console (F12 or right-click → Inspect → Console)
3. Run the following command:

```javascript
import('./lib/seed-categories.ts').then(m => m.seedCategories())
```

Or if you've already imported it:

```javascript
window.seedCategories()
```

The console will show progress as categories are created.

---

## Option 3: Using Node.js Script

For advanced users with Firebase Admin SDK configured:

1. Download your Firebase service account key
2. Save it as `firebase-key.json` in the project root
3. Run:

```bash
node scripts/seed-categories.js
```

---

## Categories That Will Be Created

1. **Travel + Living** (travel-living) - Explore destinations and lifestyle
2. **Adventure + Wildlife** (adventure-wildlife) - Thrilling experiences and nature
3. **Food + Drinks** (food-drinks) - Culinary adventures
4. **Wellness** (wellness) - Health and mindfulness
5. **Retreats** (retreats) - Peaceful getaways
6. **Changemaker** (changemaker) - Sustainable travel

---

## What Happens After Seeding?

✅ Categories are added to Firestore
✅ Header navigation automatically updates
✅ Post editor category dropdown is populated
✅ Category pages become functional
✅ All category-based filtering works

---

## Troubleshooting

**Categories already exist?**
- The seeding process checks for existing categories and skips duplicates
- You can run the seeding multiple times safely

**Not seeing categories appear?**
- Check Firestore Console → collections → categories
- Ensure you have write permissions in your Firestore security rules
- Try refreshing the page

**Need to delete categories?**
- Go to `/admin/categories` and delete them individually using the delete button
- Or use Firebase Console directly

---

## Next Steps

After seeding:
1. ✅ View your categories at `/admin/categories`
2. ✅ Create a new post at `/admin/posts/new` and assign a category
3. ✅ Visit the home page to see categories in navigation
4. ✅ Click category links to view filtered posts
