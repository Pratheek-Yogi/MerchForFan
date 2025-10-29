const database = require('../config/database');
const { ObjectId } = require('mongodb');

class ProfileService {
    // Get user profile by ID
    static async getProfile(userId) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');
            const userLoginCollection = db.collection('UserLogin');

            // Get user profile data
            const userProfile = await userDataCollection.findOne({ 
                userId: new ObjectId(userId) 
            });

            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Get additional user info from UserLogin
            const userLogin = await userLoginCollection.findOne({
                _id: new ObjectId(userId)
            });

            // Combine data for frontend
            const profileData = {
                _id: userLogin._id,
                userId: userProfile.userId,
                name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: userProfile.email,
                phone: userProfile.phone || '',
                dateOfBirth: userProfile.dateOfBirth || '',
                gender: userProfile.gender || '',
                avatar: userProfile.picture || userProfile.avatar || null,
                joinDate: userProfile.createdAt,
                totalOrders: userProfile.totalOrders || 0,
                emailNotifications: userProfile.emailNotifications !== undefined ? userProfile.emailNotifications : true,
                smsNotifications: userProfile.smsNotifications !== undefined ? userProfile.smsNotifications : false,
                createdAt: userProfile.createdAt,
                updatedAt: userProfile.updatedAt
            };

            return profileData;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(userId, updateData) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');
            const userLoginCollection = db.collection('UserLogin');

            // Prepare update data for UserData collection
            const userDataUpdate = {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                phone: updateData.phone,
                dateOfBirth: updateData.dateOfBirth,
                gender: updateData.gender,
                picture: updateData.avatar,
                emailNotifications: updateData.emailNotifications,
                smsNotifications: updateData.smsNotifications,
                updatedAt: new Date()
            };

            // Remove undefined fields
            Object.keys(userDataUpdate).forEach(key => {
                if (userDataUpdate[key] === undefined) {
                    delete userDataUpdate[key];
                }
            });

            // Update UserData collection
            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { $set: userDataUpdate },
                { returnDocument: 'after' }
            );

            if (!result) {
                throw new Error('User profile not found');
            }

            // If email is being updated, also update UserLogin collection
            if (updateData.email) {
                await userLoginCollection.updateOne(
                    { _id: new ObjectId(userId) },
                    { 
                        $set: { 
                            email: updateData.email,
                            updatedAt: new Date()
                        } 
                    }
                );

                // Also update email in UserData for consistency
                await userDataCollection.updateOne(
                    { userId: new ObjectId(userId) },
                    { 
                        $set: { 
                            email: updateData.email,
                            updatedAt: new Date()
                        } 
                    }
                );
            }

            return await this.getProfile(userId);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Update user avatar/picture
    static async updateAvatar(userId, avatarUrl) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');

            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { 
                    $set: { 
                        picture: avatarUrl,
                        updatedAt: new Date()
                    } 
                },
                { returnDocument: 'after' }
            );

            if (!result) {
                throw new Error('User profile not found');
            }

            return result;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    // Update user preferences
    static async updatePreferences(userId, preferences) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');

            const updateData = {
                emailNotifications: preferences.emailNotifications,
                smsNotifications: preferences.smsNotifications,
                updatedAt: new Date()
            };

            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result) {
                throw new Error('User profile not found');
            }

            return result;
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }

    // Check if email exists (for validation)
    static async isEmailExists(email, excludeUserId = null) {
        try {
            const db = await database.connect();
            const userLoginCollection = db.collection('UserLogin');

            const query = { email: email };
            if (excludeUserId) {
                query._id = { $ne: new ObjectId(excludeUserId) };
            }

            const existingUser = await userLoginCollection.findOne(query);
            return !!existingUser;
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw error;
        }
    }
}

module.exports = ProfileService;