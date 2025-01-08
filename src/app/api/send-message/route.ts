import  UserModel  from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/User';


export async function POST(request : Request) {
     await dbConnect();

     const {username , content} = await request.json()

     try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                { message: 'User not found', success: false },
                { status: 401 }
              );
        }

        // is user accepting the message 
          
        if(!user.isAcceptingMessages){
            return Response.json(
                { message: 'User not accepting the messages', success: false },
                { status: 401 }
            )
        }


        const newMessage = {content , createdAt: new Date()}
        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json(
            { message: 'Message send succesfully', success: true },
            { status: 200 }
        )


     } catch (error) {
        console.log("An unexpected error" , error);
        
        return Response.json(
            { message: 'Error sending the message', success: false },
            { status: 401 }
        )
        
     }

}
