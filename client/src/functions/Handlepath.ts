import { Dispatch } from "redux";
import { setactivepath } from "../redux/upaths/activepath";
import { setdata } from "../redux/Data/slice";
import { setpaths , setactiveindex } from "../redux/upaths/slice";



// Function to handle fetching path data and dispatching Redux actions
export const HandlePath = async (
  path: string,
  dispatch: Dispatch,
  paths: string[],
  activepathindex: Number
) => {

  if (path.toLowerCase() === "this pc") {
  
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/getpath", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      console.error("An error occurred while fetching the path data!");
      return;
    }

    const data = await response.json();

    if (data?.pathdata) {
      
      dispatch(setdata(data.pathdata));
      dispatch(setactivepath(!path.endsWith("/") ? path + "/" : path));
      dispatch(setpaths([...paths, path]));
      dispatch(setactiveindex(Number(activepathindex) ))
      
    } else {
      console.warn("No path data received from the server.");
    }
  } catch (error) {
    console.error("Error while handling the path:", error);
  }
};
