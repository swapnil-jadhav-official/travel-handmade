const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const OLD_SEGMENT = 'res.cloudinary.com/dzrabrzd4';
const NEW_SEGMENT = 'res.cloudinary.com/iomadqap';

const APPLY = process.argv.includes('--apply');

const COLLECTIONS = ['users', 'posts', 'categories', 'testimonials', 'travellers', 'newsletters'];
const SINGLE_DOCS = [['settings', 'general']];

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (typeof value.toDate === 'function') return false;
  if (value.constructor && value.constructor.name !== 'Object') return false;
  return true;
}

function deepReplace(value) {
  if (typeof value === 'string') {
    if (value.includes(OLD_SEGMENT)) {
      return { value: value.split(OLD_SEGMENT).join(NEW_SEGMENT), changed: true };
    }
    return { value, changed: false };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const newArr = value.map((item) => {
      const r = deepReplace(item);
      if (r.changed) changed = true;
      return r.value;
    });
    return { value: changed ? newArr : value, changed };
  }
  if (isPlainObject(value)) {
    let changed = false;
    const newObj = {};
    for (const [k, v] of Object.entries(value)) {
      const r = deepReplace(v);
      newObj[k] = r.value;
      if (r.changed) changed = true;
    }
    return { value: changed ? newObj : value, changed };
  }
  return { value, changed: false };
}

async function processDoc(collectionName, docId, data, docRef, report) {
  const updatePayload = {};
  let docChanged = false;

  for (const [fieldName, fieldValue] of Object.entries(data)) {
    const { value: newValue, changed } = deepReplace(fieldValue);
    if (changed) {
      docChanged = true;
      updatePayload[fieldName] = newValue;
      report.push({
        collection: collectionName,
        docId,
        field: fieldName,
        before: JSON.stringify(fieldValue).slice(0, 200),
        after: JSON.stringify(newValue).slice(0, 200),
      });
    }
  }

  if (docChanged && APPLY) {
    await docRef.update(updatePayload);
  }

  return docChanged;
}

(async () => {
  const report = [];
  let docsChanged = 0;
  let docsScanned = 0;

  for (const collectionName of COLLECTIONS) {
    const snapshot = await db.collection(collectionName).get();
    for (const doc of snapshot.docs) {
      docsScanned++;
      const changed = await processDoc(collectionName, doc.id, doc.data(), doc.ref, report);
      if (changed) docsChanged++;
    }
  }

  for (const [collectionName, docId] of SINGLE_DOCS) {
    const docRef = db.collection(collectionName).doc(docId);
    const snap = await docRef.get();
    if (snap.exists) {
      docsScanned++;
      const changed = await processDoc(collectionName, docId, snap.data(), docRef, report);
      if (changed) docsChanged++;
    }
  }

  const outDir = 'C:/Users/tejas/AppData/Local/Temp/claude/c--Users-tejas-OneDrive-Desktop-travel-handmade/43f0cf82-1efb-4032-b653-f41d07df0526/scratchpad/cloudinary-migration';
  const outPath = path.join(outDir, APPLY ? 'firestore-apply-report.json' : 'firestore-dryrun-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`\nMode: ${APPLY ? 'APPLY (writes committed)' : 'DRY RUN (no writes)'}`);
  console.log('Documents scanned:', docsScanned);
  console.log('Documents with Cloudinary URLs found:', docsChanged);
  console.log('Total field changes:', report.length);

  const byCollection = report.reduce((acc, r) => {
    acc[r.collection] = (acc[r.collection] || 0) + 1;
    return acc;
  }, {});
  console.log('By collection:', byCollection);
  console.log('Full report written to:', outPath);

  await admin.app().delete();
})().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
