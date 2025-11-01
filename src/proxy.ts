import { getToken } from "next-auth/jwt";
import { NextRequest,NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    const {pathname}=req.nextUrl
    const publiRoutes=[
        "/api/auth/signin",
        "/api/auth/signout",
        "/api/auth/callback/google",
        "/api/auth/session",
        "_next",
        "/favicon.ico",
    ]

    if(publiRoutes.some((route)=>pathname.startsWith(route))){
        return NextResponse.next()
    }
    else{
        const token= await getToken({req,secret:process.env.NEXTAUTH_SECRET})
        if(!token){
            const loginUrl = new URL("/signin", req.url);
            loginUrl.searchParams.set("callbackUrl", req.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next()
    }
}

export const config={
    matcher:"/((?!api/auth|_next/static|_next/image|favicon.ico | node_modules).*)"
}