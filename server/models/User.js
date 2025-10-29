const bcrypt = require('bcrypt');
const database = require('../config/database');

class User {
  constructor(userData) {
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.password = userData.password;
    this.provider = userData.provider || 'local';
    this.googleId = userData.googleId || null;
    this.picture = userData.picture || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Verify password
  async verifyPassword(plainPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(plainPassword, this.password);
  }

  // Save user to database
  async save() {
    try {
      const db = await database.connect();
      if (!db) {
        throw new Error('Database connection failed');
      }
      
      const userLoginCollection = db.collection('UserLogin');
      const userDataCollection = db.collection('UserData');
      
      // Check if user already exists
      const existingUser = await userLoginCollection.findOne({ email: this.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password before saving
      await this.hashPassword();

      // Insert user login credentials
      const loginResult = await userLoginCollection.insertOne({
        email: this.email,
        password: this.password,
        provider: this.provider,
        googleId: this.googleId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      });

      // Insert user profile data
      const dataResult = await userDataCollection.insertOne({
        userId: loginResult.insertedId,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        picture: this.picture,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      });

      console.log('User saved to UserLogin and UserData collections:', {
        loginId: loginResult.insertedId,
        dataId: dataResult.insertedId
      });

      return loginResult.insertedId;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const db = await database.connect();
      const userLoginCollection = db.collection('UserLogin');
      const userDataCollection = db.collection('UserData');
      
      // Get login credentials
      const loginData = await userLoginCollection.findOne({ email: email });
      if (!loginData) return null;

      // Get user profile data
      const userData = await userDataCollection.findOne({ userId: loginData._id });
      
      // Combine both collections data
      const user = {
        _id: loginData._id,
        email: loginData.email,
        password: loginData.password,
        provider: loginData.provider,
        googleId: loginData.googleId,
        firstName: userData ? userData.firstName : null,
        lastName: userData ? userData.lastName : null,
        picture: userData ? userData.picture : null,
        createdAt: loginData.createdAt,
        updatedAt: loginData.updatedAt
      };

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    try {
      const db = await database.connect();
      const userLoginCollection = db.collection('UserLogin');
      const userDataCollection = db.collection('UserData');
      
      // Get login credentials by Google ID
      const loginData = await userLoginCollection.findOne({ googleId: googleId });
      if (!loginData) return null;

      // Get user profile data
      const userData = await userDataCollection.findOne({ userId: loginData._id });
      
      // Combine both collections data
      const user = {
        _id: loginData._id,
        email: loginData.email,
        password: loginData.password,
        provider: loginData.provider,
        googleId: loginData.googleId,
        firstName: userData ? userData.firstName : null,
        lastName: userData ? userData.lastName : null,
        picture: userData ? userData.picture : null,
        createdAt: loginData.createdAt,
        updatedAt: loginData.updatedAt
      };

      return user;
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      throw error;
    }
  }

  // Authenticate user
  static async authenticate(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, message: 'Invalid password' };
      }

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // Create or find Google user
  static async createOrFindGoogleUser(googleUserData) {
    try {
      const db = await database.connect();
      const userLoginCollection = db.collection('UserLogin');
      const userDataCollection = db.collection('UserData');
      
      // Check if user exists by Google ID
      let user = await User.findByGoogleId(googleUserData.id);
      
      if (user) {
        // Update last login
        await userLoginCollection.updateOne(
          { googleId: googleUserData.id },
          { $set: { updatedAt: new Date() } }
        );
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword, isNewUser: false };
      }

      // Check if user exists by email
      user = await User.findByEmail(googleUserData.email);
      if (user) {
        // Link Google account to existing user
        await userLoginCollection.updateOne(
          { email: googleUserData.email },
          { 
            $set: { 
              googleId: googleUserData.id,
              provider: 'google',
              updatedAt: new Date()
            }
          }
        );
        
        // Update user data with Google picture
        await userDataCollection.updateOne(
          { userId: user._id },
          { 
            $set: { 
              picture: googleUserData.picture,
              updatedAt: new Date()
            }
          }
        );
        
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword, isNewUser: false };
      }

      // Create new user
      const newUser = new User({
        firstName: googleUserData.firstName,
        lastName: googleUserData.lastName,
        email: googleUserData.email,
        provider: 'google',
        googleId: googleUserData.id,
        picture: googleUserData.picture
      });

      const userId = await newUser.save();
      const { password: _, ...userWithoutPassword } = newUser;
      return { success: true, user: userWithoutPassword, isNewUser: true };
    } catch (error) {
      console.error('Google user creation error:', error);
      return { success: false, message: 'Failed to create/find Google user' };
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers() {
    try {
      const db = await database.connect();
      const userLoginCollection = db.collection('UserLogin');
      const userDataCollection = db.collection('UserData');
      
      // Get all login data
      const loginData = await userLoginCollection.find({}).toArray();
      
      // Get corresponding user data for each login
      const users = await Promise.all(loginData.map(async (login) => {
        const userData = await userDataCollection.findOne({ userId: login._id });
        
        return {
          _id: login._id,
          email: login.email,
          provider: login.provider,
          googleId: login.googleId,
          firstName: userData ? userData.firstName : null,
          lastName: userData ? userData.lastName : null,
          picture: userData ? userData.picture : null,
          createdAt: login.createdAt,
          updatedAt: login.updatedAt
        };
      }));
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

module.exports = User;
