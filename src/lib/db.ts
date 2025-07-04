import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI as string);
  await client.connect();
  
  const db = client.db('users');
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Note {
  _id?: string;
  identifier: string; // 8-character unique ID that serves as slug
  title: string;
  description: string;
  content: string;
  slug: string; // Will be same as identifier
  isSecret: boolean;
  secretHash?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invite {
  _id?: string;
  code: string;
  createdBy: string;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
  isUsed: boolean;
  expiresAt?: Date;
}

export class Database {
  private db: Db;
  
  constructor(db: Db) {
    this.db = db;
  }

  get users(): Collection<User> {
    return this.db.collection<User>('user');
  }

  get notes(): Collection<Note> {
    return this.db.collection<Note>('notes');
  }

  get invites(): Collection<Invite> {
    return this.db.collection<Invite>('invites');
  }

  async createUser(username: string, email: string, password: string, isAdmin: boolean = false): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const existingUser = await this.users.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    // First user is automatically admin
    const userCount = await this.users.countDocuments();
    const shouldBeAdmin = userCount === 0 || isAdmin;

    const user: User = {
      username,
      email,
      password: hashedPassword,
      isAdmin: shouldBeAdmin,
      createdAt: new Date()
    };

    const result = await this.users.insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.users.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return { ...user, _id: user._id?.toString() };
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.users.findOne({ _id: new ObjectId(userId) as any });
    return user ? { ...user, _id: user._id?.toString() } : null;
  }

  async createNote(
    title: string, 
    description: string,
    content: string, 
    isSecret: boolean, 
    secret: string | null, 
    userId: string
  ): Promise<Note> {
    let secretHash: string | undefined;
    
    if (isSecret && secret) {
      secretHash = await bcrypt.hash(secret, 10);
    }

    const identifier = await this.generateUniqueNoteIdentifier();

    const note: Note = {
      identifier,
      title,
      description,
      content,
      slug: identifier, // Use identifier as slug
      isSecret,
      secretHash,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.notes.insertOne(note);
    return { ...note, _id: result.insertedId.toString() };
  }

  async getNoteBySlug(slug: string): Promise<Note | null> {
    const note = await this.notes.findOne({ 
      $or: [{ slug }, { identifier: slug }] 
    });
    return note ? { ...note, _id: note._id?.toString() } : null;
  }

  async getUserNotes(userId: string): Promise<Note[]> {
    const notes = await this.notes.find({ userId }).toArray();
    return notes.map(note => ({ ...note, _id: note._id?.toString() }));
  }

  async updateNote(
    slug: string, 
    title: string, 
    description: string,
    content: string, 
    isSecret: boolean, 
    secret: string | null, 
    userId: string
  ): Promise<Note | null> {
    // First, find the existing note in the notes collection
    const existingNote = await this.notes.findOne({ 
      $or: [{ slug }, { identifier: slug }], 
      userId 
    });
    if (!existingNote) {
      return null;
    }

    // Build the update data
    const updateData: Partial<Note> = {
      title,
      description,
      content,
      isSecret,
      updatedAt: new Date()
    };

    const updateOperation: any = { $set: updateData };
    
    if (isSecret) {
      // If switching to secret or updating secret with new password
      if (secret && secret.trim() !== '') {
        const secretHash = await bcrypt.hash(secret, 10);
        updateData.secretHash = secretHash;
      }
    } else {
      // If switching from secret to public, remove the secretHash field completely
      updateOperation.$unset = { secretHash: "" };
    }

    // Execute the update in the notes collection using identifier for consistency
    const updateResult = await this.notes.updateOne(
      { identifier: existingNote.identifier, userId }, // Find by identifier AND userId for security
      updateOperation
    );
    
    if (updateResult.matchedCount === 0) {
      return null;
    }

    // If update was successful, fetch and return the updated note
    if (updateResult.acknowledged && updateResult.matchedCount > 0) {
      const updatedNote = await this.notes.findOne({ identifier: existingNote.identifier, userId });
      
      if (updatedNote) {
        return { ...updatedNote, _id: updatedNote._id?.toString() };
      }
    }

    return null;
  }

  async verifyNoteSecret(slug: string, secret: string): Promise<boolean> {
    const note = await this.notes.findOne({ 
      $or: [{ slug }, { identifier: slug }] 
    });
    
    if (!note || !note.isSecret || !note.secretHash) {
      return false;
    }

    return await bcrypt.compare(secret, note.secretHash);
  }

  async deleteNote(slug: string, userId: string): Promise<boolean> {
    const result = await this.notes.deleteOne({ 
      $or: [{ slug }, { identifier: slug }], 
      userId 
    });
    return result.deletedCount > 0;
  }

  async createInvite(createdBy: string, expiresInDays?: number): Promise<Invite> {
    const code = this.generateInviteCode();
    // Expires after 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    
    const invite: Invite = {
      code,
      createdBy,
      createdAt: new Date(),
      isUsed: false,
      expiresAt
    };

    const result = await this.invites.insertOne(invite);
    return { ...invite, _id: result.insertedId.toString() };
  }

  async validateInvite(code: string): Promise<boolean> {
    const invite = await this.invites.findOne({ 
      code, 
      isUsed: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    return !!invite;
  }

  async useInvite(code: string, usedBy: string): Promise<boolean> {
    const result = await this.invites.updateOne(
      { 
        code, 
        isUsed: false,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { 
        $set: { 
          isUsed: true, 
          usedBy, 
          usedAt: new Date() 
        } 
      }
    );
    
    return result.modifiedCount > 0;
  }

  async getUserInvites(userId: string): Promise<Invite[]> {
    const invites = await this.invites.find({ createdBy: userId }).toArray();
    return invites.map(invite => ({ ...invite, _id: invite._id?.toString() }));
  }

  async deleteInvite(inviteId: string, userId: string): Promise<boolean> {
    const result = await this.invites.deleteOne({ 
      _id: new ObjectId(inviteId) as any,
      createdBy: userId 
    });
    return result.deletedCount > 0;
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateNoteIdentifier(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async generateUniqueNoteIdentifier(): Promise<string> {
    let identifier: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      identifier = this.generateNoteIdentifier();
      const existingNote = await this.notes.findOne({ identifier });
      if (!existingNote) {
        return identifier;
      }
      attempts++;
    } while (attempts < maxAttempts);
    
    throw new Error('Failed to generate unique identifier');
  }
}

export async function getDatabase(): Promise<Database> {
  const { db } = await connectToDatabase();
  return new Database(db);
} 