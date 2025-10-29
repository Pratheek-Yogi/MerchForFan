const database = require('../config/database');
const { ObjectId } = require('mongodb');

class AddressService {
    static async getAddresses(userId) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');
            
            const userData = await userDataCollection.findOne({ 
                userId: new ObjectId(userId) 
            });

            if (!userData) {
                return [];
            }

            // Convert your existing address fields to addresses array
            const addresses = [];
            
            if (userData.addressline1 && userData.addressline1 !== 'null') {
                addresses.push({
                    _id: 'address1',
                    fullName: `${userData.firstName} ${userData.lastName}`,
                    phone: userData.phone || '',
                    addressLine1: userData.addressline1,
                    addressType: 'home',
                    isDefault: true
                });
            }

            if (userData.addressline2 && userData.addressline2 !== 'null') {
                addresses.push({
                    _id: 'address2',
                    fullName: `${userData.firstName} ${userData.lastName}`,
                    phone: userData.phone || '',
                    addressLine1: userData.addressline2,
                    addressType: 'work',
                    isDefault: false
                });
            }

            return addresses;
        } catch (error) {
            console.error('Error getting addresses:', error);
            throw error;
        }
    }

    static async updateAddress(userId, addressId, addressData) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');

            const updateField = addressId === 'address1' ? 'addressline1' : 'addressline2';
            
            // Store the complete address as a single string
            const fullAddress = addressData.addressLine1;

            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { 
                    $set: { 
                        [updateField]: fullAddress,
                        updatedAt: new Date()
                    } 
                },
                { returnDocument: 'after' }
            );

            return result;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    }

    static async addAddress(userId, addressData) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');

            const userData = await userDataCollection.findOne({ 
                userId: new ObjectId(userId) 
            });

            let updateField;
            if (!userData.addressline1 || userData.addressline1 === 'null') {
                updateField = 'addressline1';
            } else if (!userData.addressline2 || userData.addressline2 === 'null') {
                updateField = 'addressline2';
            } else {
                throw new Error('Maximum 2 addresses allowed');
            }

            const fullAddress = addressData.addressLine1;

            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { 
                    $set: { 
                        [updateField]: fullAddress,
                        updatedAt: new Date()
                    } 
                },
                { returnDocument: 'after' }
            );

            return { 
                _id: updateField === 'addressline1' ? 'address1' : 'address2',
                ...addressData 
            };
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    }

    static async deleteAddress(userId, addressId) {
        try {
            const db = await database.connect();
            const userDataCollection = db.collection('UserData');

            const updateField = addressId === 'address1' ? 'addressline1' : 'addressline2';

            const result = await userDataCollection.findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { 
                    $set: { 
                        [updateField]: 'null',
                        updatedAt: new Date()
                    } 
                },
                { returnDocument: 'after' }
            );

            return result;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    }
}

module.exports = AddressService;