import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from "fs";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: Request, res: Response)=>{
    const {image_url} = req.query
    console.info("URL of the image to filter: ",image_url)
    if(!image_url) res.status(400).send("Please provide the public url of the images")
    try{
      const filteredImagePath = await filterImageFromURL(image_url.toString())   
      res.sendFile(filteredImagePath)   
      res.status(200).sendFile(filteredImagePath,async(err)=>{
         await deleteLocalFiles([filteredImagePath])
        if(err){
          console.error("Error caught while sending the image", err)
        }
      })
    }catch(error){
      console.error("Error caught while processing the image", error)
      res.status(400).send("Please provide a valid public url of the image")
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();