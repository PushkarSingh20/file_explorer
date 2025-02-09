
import { setError } from "../redux/Errors/slice"
import { setMessage } from "../redux/Message/slice" 
import { setdata } from "../redux/Data/slice"
import { setSelectedFiles } from "../redux/selected/slice"
import { setType } from "../redux/selected/slice"

 export const Requestdata = async (message : string , Form_Mutation : any , dispatch : any , pathname: string  ) => {

        const response =    await Form_Mutation({ path: `http://localhost:5000/getpath`  , method: "POST" , data: {path:  pathname}})

        if (response.data.success) {
           
            
            dispatch(setdata(response.data.pathdata))
            dispatch(setMessage(message))
          
            setTimeout(() => {
               dispatch(setMessage(""))
            } , 3000)
        }
        else{
            console.log(response.data)
            dispatch(setError("An error occured!"))
         
            return
        }
        dispatch(setSelectedFiles([]))
        dispatch(setType(null));
    }