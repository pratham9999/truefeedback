/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function POST(request : Request) {
     
    await dbConnect()

   const session =  await getServerSession(authOptions)
   const user : User =  session?.user

   if(!session || !session.user){
       return Response.json({
        success : false,
        message : "Not authenticate"
       } , {
        status : 401
       })
   }
    
    const userId = user._id ;

     const {acceptMessages} = await request.json()
      
     try {

    const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages :acceptMessages},
            {new : true}
        )

        if(!updatedUser){
            return Response.json({
                success : false,
                message : "Failed to update USer"
               } , {
                status : 401
               })
        }

        return Response.json({
            success : true,
            message : "message acceptance status updated succesfully",
            updatedUser
           } , {
            status : 200
           })
        
     } catch (error) {
          console.log("failed to update user status to accept messages");
          
        return Response.json({
            success : false,
            message : "failed to update user status to accept messges"
           } , {
            status : 500
           })
        
     }

}

export async function GET(request : Request) {
    await dbConnect()

   const session =  await getServerSession(authOptions)
   const user : User =  session?.user

   if(!session || !session.user){
       return Response.json({
        success : false,
        message : "Not authenticate"
       } , {
        status : 401
       })
   }
    
    const userId = user._id ;
    
   try {

    const foundUser = await UserModel.findById(userId)

    if(!foundUser){
     return Response.json({
         success : false,
         message : "User not found"
        } , {
         status : 404
        })
    }
 
 
    return Response.json({
     success : true,
     isAcceptingMessages : foundUser.isAcceptingMessages
     
    } , {
     status : 200
    })
 
    
   } catch (error) {

    console.log(error);
    return Response.json({
        success : false,
      message : "failed to get User"
        
       } , {
        status : 500
       })
    
    
   }

}
