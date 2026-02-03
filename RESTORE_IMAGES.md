# Missing Images - Restore from Time Machine

## Instructions
Use Time Machine to restore the `public/images` folder from a backup BEFORE the data loss (around the time when the site was working).

Target folder to restore:
```
/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple/public/images
```

## Missing Images (Referenced in Code)

### Topics Folder (`public/images/topics/`)
- happy-couple-gray-hard-back-embrace-meadow.png
- elder-woman-cell-phone.png
- elder-woman-look-down-laptop-phone.png
- five-seniors-site-together-ipad.png
- happy-senior-squat-fitness-class.png
- senior-woman-hoop-earings-smile-portrait.png
- sunny-outdoor-man-wheelchair-caretaker.png
- black-grey-hair-couple-beach.png
- elder-man-beard-laptop-cell-phone.png
- gray-hair-couple-walk-golden-retriever-park.png

### Retirement Rescue Folder (`public/images/retirement-rescue/`)
- avatar-1.jpg
- avatar-2.jpg
- avatar-3.jpg
- hero-retirement-couple.jpg
- professional-advisor.jpg ✅ (already exists)

### WebP Hero Folder (`public/images/webp/hero/`)
- couple-share-coffee-meeting-home-couch.webp

## Currently Present
✅ public/images/team/professional-advisor.jpg

## After Restoring
Run these commands to commit and push:
```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"
git add public/images/
git commit -m "restore: Add all missing images from Time Machine backup"
git push origin main
```
