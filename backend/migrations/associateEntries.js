const mongoose = require('mongoose');
const DiaryEntry = require('../models/DiaryEntry');

async function migrateEntries(userId) {
  try {
    // Find all entries without a userId
    await DiaryEntry.updateMany(
      { userId: { $exists: false } }, // find entries without userId
      { $set: { userId: userId } }    // set them to your userId
    );
    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed:', error);
  }
} 