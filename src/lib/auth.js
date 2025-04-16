import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";


/**
 * Authentication configuration for Auth.js (NextAuth)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
});

/**
 * Helper function to check if a user is authenticated
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Helper function to get the current user from the database
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  return user;
}

/**
 * Register a new user
 * @param {Object} userData - User data containing email, password, and name
 * @returns {Promise<Object>} - Created user object or error
 */
export async function registerUser({ email, password, name }) {
  try {
    // Enhanced check for prisma with detailed logging
    if (!prisma) {
      console.error("Prisma client is undefined in auth.js");
      return { error: "Database connection error" };
    }
    
    if (!prisma.user) {
      console.error("prisma.user is undefined in auth.js. Available models:", Object.keys(prisma));
      return { error: "Database model configuration error" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Remove password from the returned object
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error) {
    console.error("Error registering user:", error);
    // Provide more specific error messages based on the error type
    if (error.code === 'P2002') {
      return { error: "User with this email already exists" };
    }
    return { error: "Failed to register user. Please check your database connection." };
  }
} 