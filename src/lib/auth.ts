import { User } from "@/model/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";


const authoptions: NextAuthOptions = {
  providers: [
    //add providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Please enter email and password");
        }
        await dbConnect();
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    //add callbacks here they are used to control what happens when an action is performed
    async signIn({account,user}) {
        if(account?.provider=="google"){
            await dbConnect();
            let existingUser=await User.findOne({email:user.email});
            if(!existingUser){
              existingUser= new User({
                name:user.name,
                email:user.email,
              })
            }
            user.id=existingUser._id as string;
        }
        return true;
    },


    async jwt({token,user}){
        if(user){
            token.id=user.id;
            token.email=user.email;
            token.image=user.image;
            token.name=user.name;
        }
        return token;
    },



    session({session,token}){
       if(session.user){
        session.user.id=token.id as string;
        session.user.email=token.email ;
        session.user.image=token.image as string;
        session.user.name=token.name ;
       }
         return session;
    }

  },
  session: {
    //we can configure session here
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  pages: {
    //custom pages can be added here like sign in sign out error etc
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


export default authoptions;
