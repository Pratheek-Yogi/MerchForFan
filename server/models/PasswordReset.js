const database = require('../config/database');

class PasswordReset {
  constructor() {
    this.collectionName = 'PasswordResets';
  }

  async generateResetCode(email) {
    try {
      const db = await database.connect();
      const collection = db.collection(this.collectionName);

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiry time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Remove any existing reset codes for this email
      await collection.deleteMany({ email });

      // Insert new reset code
      const resetData = {
        email,
        code,
        expiresAt,
        createdAt: new Date(),
        used: false
      };

      const result = await collection.insertOne(resetData);
      
      console.log('Password reset code generated:', { email, code, expiresAt });
      
      return {
        success: true,
        code, // In production, you would send this via email
        expiresAt
      };
    } catch (error) {
      console.error('Error generating reset code:', error);
      throw error;
    }
  }

  async verifyResetCode(email, code) {
    try {
      const db = await database.connect();
      const collection = db.collection(this.collectionName);

      const resetData = await collection.findOne({
        email,
        code,
        used: false,
        expiresAt: { $gt: new Date() }
      });

      if (!resetData) {
        return {
          success: false,
          message: 'Invalid or expired reset code'
        };
      }

      return {
        success: true,
        resetData
      };
    } catch (error) {
      console.error('Error verifying reset code:', error);
      throw error;
    }
  }

  async markCodeAsUsed(email, code) {
    try {
      const db = await database.connect();
      const collection = db.collection(this.collectionName);

      await collection.updateOne(
        { email, code },
        { $set: { used: true, usedAt: new Date() } }
      );

      console.log('Reset code marked as used:', { email, code });
    } catch (error) {
      console.error('Error marking code as used:', error);
      throw error;
    }
  }

  async cleanupExpiredCodes() {
    try {
      const db = await database.connect();
      const collection = db.collection(this.collectionName);

      const result = await collection.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      console.log(`Cleaned up ${result.deletedCount} expired reset codes`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
      throw error;
    }
  }
}

module.exports = new PasswordReset();
