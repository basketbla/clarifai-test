import React, { useState } from "react";

const UploadAndDisplayImage = () => {
    const USER_ID = 'phgjecfgg6h1';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'd2f49a87295d4075bac57232c4e932b4';
    const APP_ID = '6714352890754f76bbf3e5cd789eb54b';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';    
    const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [boxDims, setBoxDims] = useState(null);
    const [showBox, setShowBox] = useState(false);
  
//   const app = new Clarifai.App({
//     apiKey: "d2f49a87295d4075bac57232c4e932b4",
//   });

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

  const getFace = () => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => getFaceBoxDims(result.outputs[0].data.regions[0].region_info.bounding_box))
        .catch(error => console.log('error', error));
  }

  const getFaceBoxDims = (boundingBox) => {
        const image = document.getElementById("inputimage");
        var imageRect = image.getBoundingClientRect();
        // console.log(rect.top, rect.right, rect.bottom, rect.left);
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width);
        console.log(height);
        console.log(boundingBox.left_col);
        console.log(boundingBox.top_row);
        console.log(boundingBox.right_col);
        console.log(boundingBox.bottom_row);
        console.log(imageRect.left + boundingBox.left_col * width);
        console.log(imageRect.bottom + boundingBox.top_row * height);
        console.log(imageRect.left + boundingBox.right_col * width);
        console.log(imageRect.bottom + boundingBox.bottom_row * height);
        


        setBoxDims({
          leftCol: imageRect.left + boundingBox.left_col * width,
          topRow: imageRect.bottom + boundingBox.top_row * height,
          rightCol: imageRect.left + boundingBox.right_col * width,
          bottomRow: imageRect.bottom + boundingBox.bottom_row * height,
        });
        setShowBox(true);
  }

  return (
    <div style={{position: 'relative'}}>
      <h1>Upload image!</h1>
      {selectedImage && (
        <div style={{backgroundColor: 'blue', width: "250px"}}>
            <div style={{}}>
                <img id="inputimage" alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)}/>
                {
                showBox && (
                    <div id="bounding-box" style={{
                        top: boxDims.topRow,
                        right: boxDims.rightCol,
                        bottom: boxDims.bottomRow,
                        left: boxDims.leftCol,
                        borderStyle: "solid",
                        borderColor: "red",
                        borderWidth: "1px",
                        position: "absolute"
                    }}/>
                )
                }
            </div>
        </div>
      )}
      <button onClick={()=>setSelectedImage(null)}>Remove</button>
      <br />
     
      <br /> 
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      <button onClick={getFace}>Find the face</button>
    </div>
  );
};

export default UploadAndDisplayImage;